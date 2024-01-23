import { NewsSubscriberMapper } from "../../../../domain/entities/newsletter/mapper/subscriber";
import { Subscriber } from "../../../../domain/entities/newsletter/subscriber";
import {
  SubscriberRepositoryDTO,
  SubscriberRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/newsletter-repository";
import { InputWithPagination } from "../../../../domain/use-cases/helpers/dto";
import { DATABASES } from "../../../../shared/db/tableNames";
import { newsletterDb } from "../connection/knexfile";
import { withPagination } from "./mapper/WithPagination";
export class DbNewsLetterSubscriberRepository
  implements SubscriberRepositoryProtocol
{
  async create(
    request: SubscriberRepositoryDTO.Create.Request
  ): SubscriberRepositoryDTO.Create.Response {
    const result = await newsletterDb
      .insert({
        Email: request.Email,
        Name: request.Name,
      })
      .returning("Id")
      .into(DATABASES.NEWSLETTER.SUBSCRIBER);

    const id = result.length && result[0].Id;

    return id;
  }

  async update(
    request: SubscriberRepositoryDTO.Update.Request
  ): SubscriberRepositoryDTO.Update.Response {
    await newsletterDb(DATABASES.NEWSLETTER.SUBSCRIBER)
      .where({
        Id: request.Id,
      })
      .update({
        Email: request.Email,
        Name: request.Name,
      });
  }

  async delete(
    request: SubscriberRepositoryDTO.Delete.Request
  ): SubscriberRepositoryDTO.Delete.Response {
    await newsletterDb(DATABASES.NEWSLETTER.SUBSCRIBER)
      .where({
        Email: request.Email,
      })
      .delete();
  }

  async getByEmail(
    request: SubscriberRepositoryDTO.GetByEmail.Request
  ): SubscriberRepositoryDTO.GetByEmail.Response {
    const result = await newsletterDb(DATABASES.NEWSLETTER.SUBSCRIBER)
      .select("Id", "Name", "Email", "CreatedAt", "UpdatedAt")
      .where({
        Email: request.Email,
      })
      .first();

    if (!result) {
      return null;
    }

    return NewsSubscriberMapper.toDomain(result);
  }

  async getAll(
    request: InputWithPagination
  ): SubscriberRepositoryDTO.GetAll.Response {
    const result = await newsletterDb.raw(`
      SELECT "Id", "Name", "Email", "CreatedAt", "UpdatedAt"
      FROM "${DATABASES.NEWSLETTER.SUBSCRIBER}" n 
      LIMIT ${request.limit} OFFSET  ${request.pageNumber}
    `);

    if (result.rows.length === 0) {
      return null;
    }

    const data = result.rows.map((row: any) =>
      NewsSubscriberMapper.toDomain(row)
    );

    return withPagination(data, {
      count: result.rows.length,
      limit: request.limit,
      offset: request.pageNumber,
    });
  }
}
