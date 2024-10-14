import { LoginUserAccount, UserOperationControllerDTO } from "../../../@types/login-user";
import { HttpResponse } from "../../../shared/ports/http-response";
import { badRequest, created, forbidden, ok, serverError } from "../../../shared/utils/http-responses";
import { IPaginationInput, parsePaginationInput } from "../../../shared/utils/pagination";
import { faqService } from "../services";
import { createFaqCategoryValidator, deleteFaqCategoryValidator, updateFaqCategoryValidator } from "./schemas/category-validator";
import { createFaqValidator, deleteFaqValidator, updateFaqValidator } from "./schemas/faq-validator";

export class FAQController {
    static async createFaq(request: {
        question: string;
        answer: string;
        id_category: number;
    } & LoginUserAccount): Promise<HttpResponse> {
        try {
            const { answer, question, id_category, accountId } = request;

            const dto = {
                answer,
                question,
                id_category,
                accountId,
            };

            const { error } = await createFaqValidator.validate(dto);

            if (error) {
                return badRequest(error);
            }

            const result = await faqService.createFaq(dto);

            if (result.isLeft()) {
                return forbidden(result.value);
            }

            return created(result.value);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }

    static async deleteFaq(request: {
        id: number;
    } & UserOperationControllerDTO): Promise<HttpResponse> {
        try {
            const { Operation, accountId, id } = request;

            const { error } = await deleteFaqValidator.validate({
                Operation,
                accountId,
                id,
            });

            if (error) {
                return badRequest(error);
            }

            const result = await faqService.deleteFaqById(id, {
                author: accountId,
                operation: Operation,
            });

            if (result.isLeft()) {
                return forbidden(result.value);
            }

            return ok(`Faq deletado com sucesso`);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }

    static async updateFaq(request: {
        id: number;
        question: string;
        answer: string;
        id_category: number;
    } & UserOperationControllerDTO): Promise<HttpResponse> {
        try {
            const { answer, question, id_category, accountId, Operation, id } =
                request;

            const { error } = await updateFaqValidator.validate({
                answer,
                question,
                id_category,
                accountId,
                Operation,
                id,
            });

            if (error) {
                return badRequest(error);
            }

            const result = await faqService.updateFaq(
                {
                    id,
                    answer,
                    question,
                    id_category,
                },
                {
                    author: accountId,
                    operation: Operation,
                }
            );

            if (result.isLeft()) {
                return forbidden(result.value);
            }

            return ok(result.value);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }

    static async getFaqById(request: {
        id: number;
    }): Promise<HttpResponse> {
        try {
            const id_faq = request.id;
            if (!id_faq) {
                return badRequest(new Error("Id do FAQ é obrigatório"));
            }
            const result = await faqService.getFaqById({ id_faq: Number(id_faq) });

            if (result.isLeft()) {
                return forbidden(result.value);
            }

            return ok(result.value);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }

    static async getFaqs(
        request: {
            id_category?: number;
            question?: string;
        } & IPaginationInput
    ): Promise<HttpResponse> {
        try {
            const dto = {
                ...parsePaginationInput({
                    page: request.pageNumber,
                    limit: request.limit,
                }),
            };

            if (request.id_category) {
                Object.assign(dto, {
                    id_category: request.id_category,
                });
            }

            if (request.question) {
                Object.assign(dto, {
                    question: request.question,
                });
            }

            const result = await faqService.getFaqs(dto);

            if (result.isLeft()) {
                return forbidden(result.value);
            }

            return ok(result.value);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }

    static async createCategory(
        request: {
            title: string;
            description: string;
        } & LoginUserAccount
    ): Promise<HttpResponse> {
        try {
            const { description, title, accountId } = request;

            const dto = {
                description,
                title,
                accountId,
            };

            const { error } = await createFaqCategoryValidator.validate(dto);

            if (error) {
                return badRequest(error);
            }

            const result = await faqService.createCategory(
                {
                    title: title,
                    description: description,
                },
                accountId
            );

            if (result.isLeft()) {
                return badRequest(result.value);
            }

            return created(result.value);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }

    static async deleteCategory(
        request: {
            id: number;
        } & UserOperationControllerDTO
    ): Promise<HttpResponse> {
        try {
            const { Operation, accountId, id } = request;

            const { error } = await deleteFaqCategoryValidator.validate({
                Operation,
                accountId,
                id,
            });

            if (error) {
                return badRequest(error);
            }

            const result = await faqService.deleteCategory(id, {
                author: accountId,
                operation: Operation,
            });

            if (result.isLeft()) {
                return forbidden(result.value);
            }

            return ok(`Categoria ${request.id} deletada com sucesso`);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }

    static async updateCategory(
        request: {
            id: number;
            title: string;
            description: string;
        } & UserOperationControllerDTO
    ): Promise<HttpResponse> {
        try {
            const { Operation, accountId, id, description, title } = request;

            const { error } = await updateFaqCategoryValidator.validate({
                Operation,
                accountId,
                id,
                description,
                title,
            });

            if (error) {
                return badRequest(error);
            }

            const result = await faqService.updateCategory(
                {
                    id: +id,
                    title,
                    description,
                },
                {
                    author: accountId,
                    operation: Operation,
                }
            );

            if (result.isLeft()) {
                return forbidden(result.value);
            }

            return ok(result.value);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }

    static async getCategories(): Promise<HttpResponse> {
        try {
            const result = await faqService.getCategories();

            if (result.isLeft()) {
                return forbidden(result.value);
            }

            return ok(result.value);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }

}