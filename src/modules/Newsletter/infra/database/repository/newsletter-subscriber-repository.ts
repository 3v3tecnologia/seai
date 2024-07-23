import {
  NewsletterSubscriberRepositoryProtocol,
  SubscriberRepositoryDTO,
} from "../../../../../domain/use-cases/_ports/repositories/newsletter-repository";
import { toPaginatedOutput } from "../../../../../domain/use-cases/helpers/pagination";
import { newsletterDb } from "../../../../../infra/database/postgres/connection/knexfile";
import { countTotalRows } from "../../../../../infra/database/postgres/repositories/utils/paginate";
import { NewsSubscriberMapper } from "../../../model/mapper/subscriber";
import { Subscriber } from "../../../model/subscriber";

export class DbNewsLetterSubscriberRepository
  implements NewsletterSubscriberRepositoryProtocol
{
  async confirmSubscriber(code: string): Promise<void> {
    await newsletterDb("Subscriber")
      .where({
        Code: code,
      })
      .update({
        Confirmation_Status: "confirmed",
      });
  }
  async create(
    request: SubscriberRepositoryDTO.Create.Request
  ): SubscriberRepositoryDTO.Create.Response {
    const result = await newsletterDb
      .insert({
        Email: request.Email,
        Name: request.Name,
        Code: request.Code,
      })
      .returning("Id")
      .into("Subscriber");

    const id = result.length && result[0].Id;

    return id;
  }

  async update(
    request: SubscriberRepositoryDTO.Update.Request
  ): SubscriberRepositoryDTO.Update.Response {
    await newsletterDb("Subscriber")
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
    await newsletterDb("Subscriber")
      .where({
        Email: request.Email,
      })
      .delete();
  }

  async deleteByCode(code: string): Promise<void> {
    await newsletterDb("Subscriber")
      .where({
        Code: code,
      })
      .delete();
  }

  async getByEmail(
    request: SubscriberRepositoryDTO.GetByEmail.Request
  ): SubscriberRepositoryDTO.GetByEmail.Response {
    const result = await newsletterDb("Subscriber")
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

  async getByCode(
    code: string,
    status: "confirmed" | "pending"
  ): Promise<Required<Subscriber> | null> {
    const result = await newsletterDb("Subscriber")
      .select(
        "Id",
        "Name",
        "Confirmation_Status",
        "Email",
        "CreatedAt",
        "UpdatedAt"
      )
      .where({
        Code: code,
        Confirmation_Status: status,
      })
      .first();

    if (!result) {
      return null;
    }

    return NewsSubscriberMapper.toDomain(result);
  }

  async getReceiversEmails(): Promise<null | Array<string>> {
    const result = await newsletterDb
      .select("Email")
      .where({
        Confirmation_Status: "confirmed",
      })
      .from("Subscriber");

    if (!result.length) {
      return null;
    }

    return result.map((row: any) => row.Email);
  }

  async getAll(
    params: SubscriberRepositoryDTO.GetAll.Request
  ): SubscriberRepositoryDTO.GetAll.Response {
    const { pageNumber, limit, offset, name, email } = params;

    const binding = [];
    const queries: Array<string> = [];

    if (name) {
      queries.push(`WHERE (
          to_tsvector('simple', coalesce(sub."Name", ''))
          ) @@ to_tsquery('simple', '${name}:*')`);
    }

    if (email) {
      const byEmail = `
        (
            to_tsvector(
              'simple',
              COALESCE(
                  sub."Email",
                  ''
              )
          )
        ) @@ to_tsquery(
        'simple',
        '${email}:*'
        )
      `;

      if (queries.length) {
        queries.push(`OR ${byEmail}`);
      } else {
        queries.push(`WHERE ${byEmail}`);
      }
    }

    const countSQL = `
      SELECT
        count(sub."Id")
      FROM
          "Subscriber" AS sub
      ${queries.join(" ")}
    `;

    const countRows = await countTotalRows(newsletterDb)(countSQL);

    queries.push(`order by sub."Id" LIMIT ? OFFSET ?`);

    binding.push(limit);
    binding.push(offset);

    const sql = `
      SELECT "Id", "Name", "Email", "CreatedAt", "UpdatedAt"
      FROM "Subscriber" as sub
      ${queries.join(" ")}
    `;

    const response = await newsletterDb.raw(sql, binding);

    const rows = response.rows;

    if (rows.length === 0) {
      return null;
    }

    const data = rows.map((row: any) => NewsSubscriberMapper.toDomain(row));

    return toPaginatedOutput({
      data: data,
      page: pageNumber,
      limit: limit,
      count: countRows,
    });
  }
}
