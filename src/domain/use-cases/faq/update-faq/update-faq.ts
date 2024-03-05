import { Either, left, right } from "../../../../shared/Either";
import { Categories } from "../../../entities/faq/categories";
import { Category } from "../../../entities/faq/category";
import { Faq } from "../../../entities/faq/faq";
import { Command } from "../../_ports/core/command";
import { FaqRepositoryProtocol } from "../../_ports/repositories/faq-repository";

import { FaqNotExistsError } from "./errors/faq-not-exists";
import { UpdateFaqDTO, UpdateFaqProtocol } from "./ports/update-faq";

export class UpdateFaq extends Command implements UpdateFaqProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    super();
    this.faqRepository = faqRepository;
  }
  async update(
    request: UpdateFaqDTO.params
  ): Promise<Either<Error, UpdateFaqDTO.result>> {
    this.resetLog();
    const exists = await this.faqRepository.checkIfFaqAlreadyExists(request.id);

    if (exists === false) {
      return left(new FaqNotExistsError());
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

    const faqOrError = Faq.create(
      {
        answer: request.answer,
        question: request.question,
        order: request.order,
        categories: categories_props,
      },
      request.id
    );

    if (faqOrError.isLeft()) {
      return left(faqOrError.value);
    }

    const faq = faqOrError.value as Faq;

    const mappedToPersistence = {
      id: faq.id as number,
      answer: faq.answer.value,
      question: faq.question.value,
      order: faq.order as number,
      categories: faq.categories.values.map(
        (category) => category.id
      ) as number[],
    };

    await this.faqRepository.update(mappedToPersistence);

    this.addLog({
      action: "update",
      table: "FAQ",
      description: `FAQ "${
        faq.question.value.substring(0, 20) + "..."
      }" atualizado com sucesso`,
    });

    return right("FAQ atualizado com sucesso");
  }
}
