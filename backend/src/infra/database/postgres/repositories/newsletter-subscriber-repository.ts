import {
  SubscriberRepositoryDTO,
  SubscriberRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/newsletter-repository";
import { InputWithPagination } from "../../../../domain/use-cases/helpers/dto";

export class DbNewsLetterSubscriberRepository
  implements SubscriberRepositoryProtocol
{
  create(
    request: SubscriberRepositoryDTO.Create.Request
  ): SubscriberRepositoryDTO.Create.Response {
    throw new Error("Method not implemented.");
  }
  update(
    request: SubscriberRepositoryDTO.Update.Request
  ): SubscriberRepositoryDTO.Update.Response {
    throw new Error("Method not implemented.");
  }
  delete(
    request: SubscriberRepositoryDTO.Delete.Request
  ): SubscriberRepositoryDTO.Delete.Response {
    throw new Error("Method not implemented.");
  }
  getById(
    request: SubscriberRepositoryDTO.GetById.Request
  ): SubscriberRepositoryDTO.GetById.Response {
    throw new Error("Method not implemented.");
  }
  getAll(
    request: InputWithPagination
  ): SubscriberRepositoryDTO.GetAll.Response {
    throw new Error("Method not implemented.");
  }
}
