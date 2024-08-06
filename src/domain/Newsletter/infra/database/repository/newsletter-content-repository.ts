import {
  logsDb,
  newsletterDb,
} from "../../../../../shared/infra/database/postgres/connection/knexfile";
import { countTotalRows } from "../../../../../shared/infra/database/postgres/paginate";
import {
  IOutputWithPagination,
  IPaginationInput,
  toPaginatedOutput,
} from "../../../../../shared/utils/pagination";

import { UserCommandOperationProps } from "../../../../Logs/protocols/logger";
import { Content } from "../../../model/content";
import { NewsMapper } from "../../../model/mapper/newsletter";
import { NewsRepositoryProtocol } from "./protocol/newsletter-repository";

export class DbNewsLetterContentRepository implements NewsRepositoryProtocol {
  async create(
    news: {
      Title: string;
      Description: string | null;
      Data: any;
      SendDate?: string;
      LocationName?: string;
    },
    accountId: number
  ): Promise<number> {
    const result = await newsletterDb
      .insert({
        Title: news.Title,
        Description: news.Description,
        SendDate: news.SendDate,
        Content: news.Data,
      })
      .returning("Id")
      .into("News");

    const id = result.length && result[0].Id;

    await logsDb
      .withSchema("users")
      .insert({
        User_Id: accountId,
        Resource: "newsletter",
        Operation: "create",
        Description: "Criação de notícia",
      })
      .into("Operations");

    return id;
  }

  async getNewsById(id: number): Promise<{
    Id: number;
    Title: string;
    Description: string;
    Data: string;
    CreatedAt: string;
    UpdatedAt: string;
    SendDate: string;
  } | null> {
    const result = await newsletterDb.raw(
      `
      SELECT
          n."Id" ,
          n."Title" ,
          n."Description" ,
          n."Content" ,
          n."CreatedAt" ,
          n."UpdatedAt",
          n."SendAt",
          n."SendDate"
      FROM "News" n
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
      // Author: {
      //   Id: newsRow.Fk_Sender,
      //   Email: newsRow.Email,
      //   Organ: newsRow.Organ,
      // },
      Title: newsRow.Title,
      Description: newsRow.Description,
      Data: newsRow.Content,
      CreatedAt: newsRow.CreatedAt,
      SendDate: newsRow.SendDate,
      UpdatedAt: newsRow.UpdatedAt,
    };
  }

  async updateSendAt(id: number): Promise<void> {
    await newsletterDb("News")
      .where({
        Id: id,
      })
      .update({
        SentAt: newsletterDb.fn.now(),
      });
  }

  async update(
    news: {
      Id: number;
      Title: string;
      Description: string | null;
      Data: any;
      LocationName?: string;
      SendDate?: string;
    },
    operation: UserCommandOperationProps
  ): Promise<void> {
    await newsletterDb("News")
      .where({
        Id: news.Id,
      })
      .update({
        Title: news.Title,
        Description: news.Description,
        SendDate: news.SendDate,
        Content: news.Data,
      });

    await logsDb
      .insert({
        User_Id: operation.author,
        Resource: "newsletter",
        Operation: "update",
        Description: operation.operation,
      })
      .withSchema("users")
      .into("Operations");
  }

  async delete(
    id: number,
    operation: UserCommandOperationProps
  ): Promise<void> {
    await newsletterDb("News").where({ Id: id }).delete();

    await logsDb
      .insert({
        User_Id: operation.author,
        Resource: "newsletter",
        Operation: "delete",
        Description: operation.operation,
      })
      .withSchema("users")
      .into("Operations");
  }

  async getById(id: number): Promise<Content | null> {
    const result = await newsletterDb.raw(
      `
      SELECT
          n."Id" ,
          n."Title" ,
          n."Description" ,
          n."Content" ,
          n."CreatedAt" ,
          n."UpdatedAt",
          n."SentAt",
          n."SendDate"
      FROM "News" n
      WHERE n."Id" = ?
    `,
      [id]
    );

    if (!result.rows.length) {
      return null;
    }

    return NewsMapper.toDomain(result.rows[0]);
  }

  async getAll(
    params: {
      only_sent: boolean;
      title?: string;
      sendDate?: string;
    } & IPaginationInput
  ): Promise<IOutputWithPagination<Required<Content>> | null> {
    const { pageNumber, limit, offset, title, sendDate } = params;

    const binding = [];

    const queries: Array<string> = [];

    if (params.only_sent) {
      queries.push(`WHERE news."SentAt"  IS NOT NULL`);
    }

    if (title) {
      queries.push(`${queries.length ? "AND" : "WHERE"} (
          to_tsvector('simple', coalesce(news."Title", ''))
          ) @@ to_tsquery('simple', '${title}:*')`);
    }

    if (sendDate) {
      queries.push(
        `${queries.length ? "AND" : "WHERE"} news."SendDate"::date = ?`
      );
      binding.push(sendDate);
    }

    const countSQL = `
      SELECT count(news."Id") FROM "News" as news
      ${queries.join(" ")}
    `;

    const countRows = await countTotalRows(newsletterDb)(countSQL, binding);

    queries.push(`ORDER BY news."SendDate" DESC LIMIT ? OFFSET ?`);

    binding.push(limit);
    binding.push(offset);

    const response = await newsletterDb.raw(
      `
      SELECT
          news."Id" ,
          news."Title" ,
          news."Description" ,
          news."CreatedAt" ,
          news."UpdatedAt",
          news."SentAt",
          news."SendDate"
      FROM "News" as news
      ${queries.join(" ")}
    `,
      binding
    );

    const rows = response.rows;

    if (rows.length === 0) {
      return null;
    }

    const news = rows.map((row: any) => NewsMapper.toDomain(row));

    return toPaginatedOutput<Required<Content>>({
      data: news,
      page: pageNumber,
      limit: limit,
      count: countRows,
    });
  }
}
