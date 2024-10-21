import { Either, left, right } from "../../../shared/Either";
import { IOutputWithPagination, IPaginationInput } from "../../../shared/utils/pagination";
import { UserCommandOperationProps } from "../../Logs/core/protocols/logger";
import { FaqRepositoryProtocol } from "../infra/repository/protocol/faq-repository";
import { FaqCategoriesData, FaqWithCategoriesData } from "../infra/repository/protocol/faqData";
import { Category } from "../core/model/category";
import { Faq } from "../core/model/faq";
import { CreateFaqCategoryErrors } from "./errors/category-already-exists";
import { FaqNotExistsError } from "./errors/faq-not-exists";
import { QuestionAlreadyExistsError } from "./errors/question-exists";
import { UpdateFaqCategoryErrors } from "./errors/update-faq-category-errors";
import { IFaqService } from "./protocols/faq.service";


export class FaqService implements IFaqService {
    constructor(private readonly faqRepository: FaqRepositoryProtocol) { }

    async createFaq(
        request: {
            question: string;
            answer: string;
            id_category: number;
            accountId: number;
        }
    ): Promise<Either<Error, number>> {
        const alreadyExists = await this.faqRepository.checkIfQuestionAlreadyExists(
            request.question
        );

        if (alreadyExists) {
            return left(new QuestionAlreadyExistsError());
        }

        const category = await this.faqRepository.getCategoryById(
            request.id_category
        );

        if (category === null) {
            return left(new Error("Não foi possível localizar categoria"));
        }

        const categoryProps = Category.create({
            id: category.id,
            props: {
                title: category.title,
                description: category.description,
                created_at: category.created_at,
                updated_at: category.updated_at,
            },
        });

        if (categoryProps.isLeft()) {
            return left(categoryProps.value);
        }

        const faqOrError = Faq.create({
            answer: request.answer,
            question: request.question,
            category: categoryProps.value as Category,
        });

        if (faqOrError.isLeft()) {
            return left(faqOrError.value);
        }

        const faq = faqOrError.value as Faq;

        const faqId = await this.faqRepository.addFaq(
            {
                answer: faq.answer.value,
                question: faq.question.value,
                category_id: faq.category.id as number,
            },
            request.accountId
        );

        if (faqId === null) {
            return left(new Error("Não foi possível completar registro do FAQ"));
        }

        return right(faqId);
    }

    async updateFaq(
        request: {
            id: number;
            question: string;
            answer: string;
            id_category: number;
        },
        operation: UserCommandOperationProps
    ): Promise<Either<Error, string>> {
        const exists = await this.faqRepository.checkIfFaqAlreadyExists(request.id);

        if (exists === false) {
            return left(new FaqNotExistsError());
        }

        const category = await this.faqRepository.getCategoryById(
            request.id_category
        );

        if (category === null) {
            return left(new Error("Não foi possível localizar categoria"));
        }

        const categoryProps = Category.create({
            id: category.id,
            props: {
                title: category.title,
                description: category.description,
                created_at: category.created_at,
                updated_at: category.updated_at,
            },
        });

        if (categoryProps.isLeft()) {
            return left(categoryProps.value);
        }

        const faqOrError = Faq.create(
            {
                answer: request.answer,
                question: request.question,
                category: categoryProps.value as Category,
            },
            request.id
        );

        if (faqOrError.isLeft()) {
            return left(faqOrError.value);
        }

        const faq = faqOrError.value as Faq;

        await this.faqRepository.updateFaq(
            {
                id: faq.id as number,
                answer: faq.answer.value,
                question: faq.question.value,
                category_id: faq.category.id as number,
            },
            operation
        );

        return right("FAQ atualizado com sucesso");
    }

    async getFaqById(
        request: { id_faq: number }
    ): Promise<Either<Error, FaqWithCategoriesData | null>> {
        const faq = await this.faqRepository.getFaqById(request.id_faq);
        return right(faq);
    }

    async deleteFaqById(
        id: number,
        operation: UserCommandOperationProps
    ): Promise<Either<Error, string>> {
        const exists = await this.faqRepository.getFaqById(id);

        if (!exists) {
            return left(new Error("Faq não encontrado"));
        }

        await this.faqRepository.deleteFaqById(id, operation);

        return right("Faq deletado com sucesso");
    }

    async getFaqs(
        params: {
            id_category?: number;
            question?: string;
        } & IPaginationInput
    ): Promise<Either<Error, IOutputWithPagination<FaqWithCategoriesData>>> {
        const { limit, offset, pageNumber } = params;

        if (params.id_category) {
            return right(
                await this.faqRepository.getFagsByCategory({
                    id_category: params.id_category,
                    limit,
                    offset,
                    pageNumber,
                })
            );
        }

        const { question } = params;

        return right(
            await this.faqRepository.getFaqs({
                limit,
                offset,
                pageNumber,
                question,
            })
        );
    }

    async createCategory(
        request: {
            title: string;
            description: string;
        },
        accountId: number
    ): Promise<Either<Error, number>> {
        const categoryOrError = Category.create({
            props: {
                title: request.title,
                description: request.description,
            },
        });

        if (categoryOrError.isLeft()) {
            return left(categoryOrError.value);
        }

        const category = categoryOrError.value as Category;

        const alreadyExists = await this.faqRepository.getCategoryByTitle(
            category.title as string
        );

        if (alreadyExists) {
            return left(new CreateFaqCategoryErrors.CategoryAlreadyExists());
        }

        const id = await this.faqRepository.addCategory(
            category.title as string,
            category.description as string,
            accountId
        );

        return right(id);
    }

    async deleteCategory(
        id_category: number,
        operation: UserCommandOperationProps
    ): Promise<Either<Error, any>> {
        const isAssociatedWithFaq =
            await this.faqRepository.checkIfCategoryIsAlreadyAssociated(id_category);

        if (isAssociatedWithFaq) {
            return left(
                new Error("Não é possível apagar categorias associadas a algum FAQ")
            );
        }

        const exists = await this.faqRepository.getCategoryById(id_category);

        if (!exists) {
            return left(new Error("Categoria não existe"));
        }

        await this.faqRepository.deleteCategoryById(id_category, operation);

        return right("Categoria deletada com sucesso");
    }

    async updateCategory(
        request: {
            id: number;
            title: string;
            description: string;
        },
        operation: UserCommandOperationProps
    ): Promise<Either<Error, string>> {
        const exists = await this.faqRepository.getCategoryById(
            request.id as number
        );

        if (!exists) {
            return left(new UpdateFaqCategoryErrors.CategoryNotExists());
        }

        const categoryOrError = Category.create({
            id: request.id,
            props: {
                title: request.title,
                description: request.description,
            },
        });

        if (categoryOrError.isLeft()) {
            return left(categoryOrError.value);
        }

        const category = categoryOrError.value as Category;

        const existingCategory = await this.faqRepository.getCategoryByTitle(
            category.title as string
        );

        if (existingCategory && existingCategory.id !== category.id) {
            return left(new CreateFaqCategoryErrors.CategoryAlreadyExists());
        }

        await this.faqRepository.updateCategory(
            {
                id_category: category.id as number,
                title: category.title as string,
                description: category.description as string,
            },
            operation
        );

        return right("Categoria atualizada sucesso");
    }

    async getCategories(): Promise<Either<Error, Array<FaqCategoriesData> | null>> {
        return right(await this.faqRepository.getCategories());
    }

}
