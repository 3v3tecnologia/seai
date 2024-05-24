import { NewsMapper } from "../../../../domain/entities/newsletter/mapper/news";
import { Content } from "../../../../domain/entities/newsletter/news";
import {
  ContentRepositoryDTO,
  NewsRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/newsletter-repository";
import { toPaginatedOutput } from "../../../../domain/use-cases/helpers/pagination";
import { DATABASES } from "../../../../shared/db/tableNames";
import { newsletterDb } from "../connection/knexfile";
import { countTotalRows, } from "./utils/paginate";

export class DbNewsLetterContentRepository implements NewsRepositoryProtocol {
  async create(
    request: ContentRepositoryDTO.Create.Request
  ): ContentRepositoryDTO.Create.Response {
    const result = await newsletterDb
      .insert({
        Fk_Sender: request.FK_Author,
        Title: request.Title,
        Description: request.Description,
        Content: request.Data,
      })
      .returning("Id")
      .into(DATABASES.NEWSLETTER.NEWS);

    const id = result.length && result[0].Id;

    return id;
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
          s."Organ" ,
          s."SendAt",
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

  async updateSendAt(id: number): Promise<void> {
    await newsletterDb(DATABASES.NEWSLETTER.NEWS)
      .where({
        Id: id
      })
      .update({
        SentAt: newsletterDb.fn.now()
      })

  }
  async deleteJobFromNews(id_news: number): Promise<void> {
    await newsletterDb(DATABASES.NEWSLETTER.NEWS_JOBS)
      .where({
        Fk_News: id_news,
      })
      .delete();
  }

  async getIdJobFromNews(id_news: number): Promise<string | null> {
    const result = await newsletterDb(DATABASES.NEWSLETTER.NEWS_JOBS)
      .select("*")
      .where({
        Fk_News: id_news,
      })
      .first();

    if (!result) {
      return null;
    }

    return result.Fk_Job;
  }

  async update(
    request: ContentRepositoryDTO.Update.Request
  ): ContentRepositoryDTO.Update.Response {
    await newsletterDb(DATABASES.NEWSLETTER.NEWS)
      .where({
        Id: request.Id,
      })
      .update({
        Fk_Sender: request.FK_Author,
        Title: request.Title,
        Description: request.Description,
        Content: request.Data
      });
  }

  async delete(
    request: ContentRepositoryDTO.Delete.Request
  ): ContentRepositoryDTO.Delete.Response {
    await newsletterDb(DATABASES.NEWSLETTER.NEWS)
      .where({ Id: request.Id })
      .delete();
  }

  async getById(
    request: ContentRepositoryDTO.GetById.Request
  ): ContentRepositoryDTO.GetById.Response {
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
          s."Organ",
          n."SentAt"
      FROM "${DATABASES.NEWSLETTER.NEWS}" n 
      INNER JOIN "${DATABASES.NEWSLETTER.SENDER}" s 
      ON s."Id" = n."Fk_Sender" 
      WHERE n."Id" = ?
    `,
      [request.Id]
    );

    if (!result.rows.length) {
      return null;
    }

    return NewsMapper.toDomain(result.rows[0]);
  }

  async getAll(
    params: ContentRepositoryDTO.GetAll.Request
  ): ContentRepositoryDTO.GetAll.Response {
    const { pageNumber, limit, offset, title } = params;

    const binding = [];

    const queries: Array<string> = [];

    if (title) {
      queries.push(`WHERE (
          to_tsvector('simple', coalesce(news."Title", '')) 
          ) @@ to_tsquery('simple', '${title}:*')`);
    }

    const countSQL = `
      SELECT count(news."Id") FROM "${DATABASES.NEWSLETTER.NEWS}" as news
      ${queries.join(" ")}
    `;

    const countRows = await countTotalRows(newsletterDb)(countSQL);

    queries.push(`order by news."Id" LIMIT ? OFFSET ?`);

    binding.push(limit);
    binding.push(offset);

    const response = await newsletterDb.raw(`
      SELECT 
          news."Id" ,
          news."Fk_Sender" ,
          news."Title" ,
          news."Description" ,
          news."CreatedAt" ,
          news."UpdatedAt",
          news."SentAt",
          sender."Email" ,
          sender."Organ" 
      FROM "${DATABASES.NEWSLETTER.NEWS}" as news 
      INNER JOIN "${DATABASES.NEWSLETTER.SENDER}" as sender
      ON sender."Id" = news."Fk_Sender" 
      ${queries.join(" ")}
    `, binding);

    const rows = response.rows

    if (rows.length === 0) {
      return null;
    }

    const news = rows.map((row: any) => NewsMapper.toDomain(row));

    console.log(news);

    return toPaginatedOutput<Required<Content>>({
      data: news,
      page: pageNumber,
      limit: limit,
      count: countRows,
    });
  }
}
