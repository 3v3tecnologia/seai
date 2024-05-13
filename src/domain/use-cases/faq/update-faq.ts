import { Either, left, right } from "../../../shared/Either";
import { Category } from "../../entities/faq/category";
import { Faq } from "../../entities/faq/faq";
import { Command } from "../_ports/core/command";
import { FaqRepositoryProtocol } from "../_ports/repositories/faq-repository";

import { FaqNotExistsError } from "./errors/faq-not-exists";
import { UpdateFaqDTO, UpdateFaqProtocol } from "./protocols/update-faq";

export class UpdateFaq extends Command implements UpdateFaqProtocol {
  private readonly faqRepository: FaqRepositoryProtocol;

  constructor(faqRepository: FaqRepositoryProtocol) {
    super();
    this.faqRepository = faqRepository;
  }
  async execute(
    request: UpdateFaqDTO.params
  ): Promise<Either<Error, UpdateFaqDTO.result>> {
    this.resetLog();
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
        updated_at: category.updated_at
      }
    });

    if (categoryProps.isLeft()) {
      return left(categoryProps.value)
    }

    const faqOrError = Faq.create(
      {
        answer: request.answer,
        question: request.question,
        order: request.order,
        category: categoryProps.value as Category,
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
      category_id: faq.category.id as number,
    };

    await this.faqRepository.updateFaq(mappedToPersistence);

    this.addLog({
      action: "update",
      table: "FAQ",
      description: `FAQ "${faq.question.value.substring(0, 20) + "..."
        }" atualizado com sucesso`,
    });

    return right("FAQ atualizado com sucesso");
  }
}
