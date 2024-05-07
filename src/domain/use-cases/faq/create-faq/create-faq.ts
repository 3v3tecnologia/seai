import { FaqRepositoryProtocol } from "../../_ports/repositories/faq-repository";
import { Either, left, right } from "../../../../shared/Either";
import { CreateFaqDTO, CreateFaqProtocol } from "./ports/create-faq";
import { QuestionAlreadyExistsError } from "./errors/question-exists";
import { Command } from "../../_ports/core/command";
import { Faq } from "../../../entities/faq/faq";
import { Category } from "../../../entities/faq/category";
import { Categories } from "../../../entities/faq/categories";

export class CreateFaq extends Command implements CreateFaqProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    super();
    this.faqRepository = faqRepository;
  }
  async create(
    request: CreateFaqDTO.params
  ): Promise<Either<Error, CreateFaqDTO.result>> {
    this.resetLog();
    const alreadyExists = await this.faqRepository.checkIfQuestionAlreadyExists(
      request.question
    );

    if (alreadyExists) {
      return left(new QuestionAlreadyExistsError());
    }

    const categories = await this.faqRepository.loadCategoriesByIds(
      request.categories
    );

    if (categories === null) {
      return left(new Error("Não foi possível localizar categorias"));
    }

    const categories_not_found: Array<string> = [];

    request.categories.forEach((id) => {
      const exists = categories.some((category) => {
        return category.id === id;
      });

      if (!exists) {
        categories_not_found.push(
          `Categoria com identificador ${id} não existe`
        );
      }
    });

    if (categories_not_found.length) {
      return left(new Error(categories_not_found.join("; ")));
    }

    const category_list: Array<Category> = [];

    request.categories.forEach((category_id) => {
      const categoryOrError = Category.create({
        id: category_id,
      });

      if (categoryOrError.isRight()) {
        category_list.push(categoryOrError.value as Category);
      }
    });

    const categories_props = Categories.create(category_list);

    const faqOrError = Faq.create({
      answer: request.answer,
      question: request.question,
      order: request.order,
      categories: categories_props,
    });

    if (faqOrError.isLeft()) {
      return left(faqOrError.value);
    }

    const faq = faqOrError.value as Faq;

    const mappedToPersistence = {
      answer: faq.answer.value,
      question: faq.question.value,
      order: faq.order as number,
      categories: faq.categories.values.map(
        (category) => category.id
      ) as number[],
    };

    const faqId = await this.faqRepository.add(mappedToPersistence);

    if (faqId === null) {
      return left(new Error("Não foi possível completar registro do FAQ"));
    }

    this.addLog({
      action: "create",
      table: "FAQ",
      description: `FAQ criado com sucesso`,
    });

    return right(faqId);
  }
}
