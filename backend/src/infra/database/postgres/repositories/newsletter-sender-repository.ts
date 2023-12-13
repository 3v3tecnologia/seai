import {
  NewsletterSenderRepositoryDTO,
  SenderRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/newsletter-repository";
import { InputWithPagination } from "../../../../domain/use-cases/helpers/dto";

export class DbNewsLetterSenderRepository implements SenderRepositoryProtocol {
  create(
    request: NewsletterSenderRepositoryDTO.Create.Request
  ): NewsletterSenderRepositoryDTO.Create.Response {
    throw new Error("Method not implemented.");
  }
  update(
    request: NewsletterSenderRepositoryDTO.Update.Request
  ): NewsletterSenderRepositoryDTO.Update.Response {
    throw new Error("Method not implemented.");
  }
  delete(
    request: NewsletterSenderRepositoryDTO.Delete.Request
  ): NewsletterSenderRepositoryDTO.Delete.Response {
    throw new Error("Method not implemented.");
  }
  getById(
    request: NewsletterSenderRepositoryDTO.GetById.Request
  ): NewsletterSenderRepositoryDTO.GetById.Response {
    throw new Error("Method not implemented.");
  }
  getAll(
    request: InputWithPagination
  ): NewsletterSenderRepositoryDTO.GetAll.Response {
    throw new Error("Method not implemented.");
  }
}
