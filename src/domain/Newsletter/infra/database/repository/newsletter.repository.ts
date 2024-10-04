import { NEWSLETTER_PUBLIC_URL, USER_IRRIGANT_PUBLIC_URL } from "../../../../../server/http/config/url";
import {
  governmentDb,
  logsDb,
  newsletterDb,
} from "../../../../../shared/infra/database/postgres/connection/knexfile";
import { countTotalRows } from "../../../../../shared/infra/database/postgres/paginate";
import { PaginatedInput } from "../../../../../shared/utils/command";
import {
  IOutputWithPagination,
  IPaginationInput,
  toPaginatedOutput,
} from "../../../../../shared/utils/pagination";

import { UserCommandOperationProps } from "../../../../Logs/protocols/logger";
import { Content } from "../../../model/content";
import { NewsMapper } from "../../../model/mapper/newsletter";
import { NewsSubscriberMapper } from "../../../model/mapper/subscriber";
import { Subscriber } from "../../../model/subscriber";
import { NewsletterRepositoryProtocol } from "./protocol/newsletter-repository";

export class NewsLetterRepository implements NewsletterRepositoryProtocol {

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
    const result = await governmentDb
      .withSchema("newsletter")
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
    const result = await governmentDb.raw(
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
      FROM newsletter."News" n
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
      Title: newsRow.Title,
      Description: newsRow.Description,
      Data: newsRow.Content,
      CreatedAt: newsRow.CreatedAt,
      SendDate: newsRow.SendDate,
      UpdatedAt: newsRow.UpdatedAt,
    };
  }

  // TO-DO: update sendAt by date
  async markAsSent(date: string): Promise<void> {
    await governmentDb.raw(`
      UPDATE newsletter."News"
      SET "SentAt" = NOW()
      WHERE "SendDate"::date = ?
    `, [date])
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
    await governmentDb("News")
      .withSchema("newsletter")
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
    await governmentDb("News").withSchema("newsletter").where({ Id: id }).delete();

    await governmentDb
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
    const result = await governmentDb.raw(
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
      FROM newsletter."News" n
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
    params: PaginatedInput<{
      only_sent: boolean;
      title?: string;
      sendDate?: string;
    }>
  ): Promise<IOutputWithPagination<Required<Content>> | null> {
    const { title, sendDate } = params.data;
    const { limit, offset, pageNumber } = params.paginate;

    const binding = [];

    const queries: Array<string> = [];

    // Filter by current or old date
    if (params.data.only_sent) {
      // Current date in YYYY-MM-DD format
      const date = new Date().toISOString().split('T')[0]

      queries.push(`WHERE news."SendDate"::date <= ?`);
      binding.push(date);
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
      SELECT count(news."Id") FROM newsletter."News" as news
      ${queries.join(" ")}
    `;

    const countRows = await countTotalRows(governmentDb)(countSQL, binding);

    queries.push(`ORDER BY news."SendDate" DESC LIMIT ? OFFSET ?`);

    binding.push(limit);
    binding.push(offset);

    const response = await governmentDb.raw(
      `
      SELECT
          news."Id" ,
          news."Title" ,
          news."Description" ,
          news."CreatedAt" ,
          news."UpdatedAt",
          news."SentAt",
          news."SendDate"
      FROM newsletter."News" as news
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

  async getUnsetNewsByDate(sendDate: string): Promise<Array<{ Link: string } & Pick<Content, 'Title' | 'Description' | 'Id'>>> {


    const response = await governmentDb.raw(
      `
      SELECT
          news."Id" ,
          news."Title" ,
          news."Description"
      FROM newsletter."News" as news
      WHERE news."SendDate"::date <= ?
      AND news."SendDate"::date >= (?::date - INTERVAL '1 day')::date
      AND news."SentAt" IS NULL
      ORDER BY news."SendDate" DESC
    `,
      [sendDate, sendDate]
    );

    const rows = response.rows;

    return rows.map(({ Id, Title, Description }: { Id: number, Title: string, Description: string }) => ({
      Id,
      Title,
      Description,
      Link: `${NEWSLETTER_PUBLIC_URL}/${Id}`
    }))
  }

  async getReceiversEmails(): Promise<Array<{
    Email: string;
    Code: string;
  }>> {
    const result = await governmentDb.raw(`
        with UserWithNewsletter as (
          select
            *
          from
            management."User_Notifications" un
          inner join management."Notification_Services" ns 
          on
            un.service_id = ns.id
          where
            ns.service_id = 'newsletter'
            and un.enabled = true
          )
          select
            u."Email",
            u."Code"
          from
            UserWithNewsletter
          inner join users."User" u 
          on
            u."Id" = UserWithNewsletter.user_id
      `)

    return result.rows.map(({ Email, Code }: any) => {
      return {
        Email,
        Code,
      };
    });
  }

  async getSubscriberByEmail(
    email: string
  ): Promise<Required<Subscriber> | null> {
    const result = await governmentDb("Subscriber")
      .select("Id", "Email", "CreatedAt", "UpdatedAt")
      .withSchema("newsletter")
      .where({
        Email: email,
      })
      .first();

    if (!result) {
      return null;
    }

    return NewsSubscriberMapper.toDomain(result);
  }

  async subscribe(
    request: {
      Email: string;
      Code: string;
      Status?: "pending" | "confirmed";
    }
  ): Promise<number> {
    const data = {
      Email: request.Email,
      Code: request.Code,
    };

    if (request.Status) {
      Object.assign(data, {
        Confirmation_Status: request.Status,
      });
    }

    const result = await governmentDb
      .withSchema("newsletter")
      .insert(data)
      .returning("Id")
      .into("Subscriber");

    const id = result.length && result[0].Id;

    return id;
  }

  async unsubscribe(
    email: string
  ): Promise<void> {
    await governmentDb("Subscriber")
      .withSchema("newsletter")
      .where({
        Email: email,
      })
      .delete();
  }
}
