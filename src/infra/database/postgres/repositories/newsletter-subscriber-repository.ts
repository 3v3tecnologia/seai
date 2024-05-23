import { NewsSubscriberMapper } from "../../../../domain/entities/newsletter/mapper/subscriber";
import { Subscriber } from "../../../../domain/entities/newsletter/subscriber";
import {
  SubscriberRepositoryDTO,
  SubscriberRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/newsletter-repository";
import { parsePaginationInput, toPaginatedOutput } from "../../../../domain/use-cases/helpers/pagination";
import { DATABASES } from "../../../../shared/db/tableNames";
import { newsletterDb } from "../connection/knexfile";
import { withPagination } from "./mapper/WithPagination";
import { countTotalRows } from "./utils/paginate";
export class DbNewsLetterSubscriberRepository
  implements SubscriberRepositoryProtocol {
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

  async getReceiversEmails(): Promise<null | Array<{ Email: string }>> {
    const result = await newsletterDb.select('Email').from(DATABASES.NEWSLETTER.SUBSCRIBER)

    if (!result.length) {
      return null;
    }

    return result.map((row: any) => {
      return {
        Email: row.Email,
      };
    });
  }

  async getNewsById(id: number) {
    const result = await newsletterDb.raw(
      `
      SELECT 
          n."Id" ,
          n."Fk_Sender" ,
          n."Title" ,
          n."Description" ,
          n."Content" ,
          n."CreatedAt" ,
          n."UpdatedAt",
          s."Email" ,
          s."Organ" 
      FROM "${DATABASES.NEWSLETTER.NEWS}" n 
      INNER JOIN "${DATABASES.NEWSLETTER.SENDER}" s 
      ON s."Id" = n."Fk_Sender" 
      WHERE n."Id" = ?
    `,
      [id]
    );

    if (!result.rows.length) {
      return null;
    }

    const newsRow = result.rows[0];

    return {
      Id: newsRow.Id,
      Author: {
        Id: newsRow.Fk_Sender,
        Email: newsRow.Email,
        Organ: newsRow.Organ,
      },
      Title: newsRow.Title,
      Description: newsRow.Description,
      Data: newsRow.Content,
      CreatedAt: newsRow.CreatedAt,
      UpdatedAt: newsRow.UpdatedAt,
    };
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
      `

      if (queries.length) {
        queries.push(`OR ${byEmail}`)
      } else {
        queries.push(`WHERE ${byEmail}`)
      }
    }

    const countSQL = `
      SELECT
        count(sub."Id")
      FROM
          "${DATABASES.NEWSLETTER.SUBSCRIBER}" AS sub
      ${queries.join(" ")}
    `;

    const countRows = await countTotalRows(newsletterDb)(countSQL);

    queries.push(`order by sub."Id" LIMIT ? OFFSET ?`);

    binding.push(limit);
    binding.push(offset);

    const sql = `
      SELECT "Id", "Name", "Email", "CreatedAt", "UpdatedAt"
      FROM "${DATABASES.NEWSLETTER.SUBSCRIBER}" as sub 
      ${queries.join(" ")}
    `

    const response = await newsletterDb.raw(sql, binding);


    const rows = response.rows

    if (rows.length === 0) {
      return null;
    }

    const data = rows.map((row: any) =>
      NewsSubscriberMapper.toDomain(row)
    );

    return toPaginatedOutput({
      data: data,
      page: pageNumber,
      limit: limit,
      count: countRows,
    });
  }
}
