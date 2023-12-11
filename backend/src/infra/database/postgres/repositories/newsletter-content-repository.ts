import { NewsMapper } from "../../../../domain/entities/newsletter/mapper/news";
import {
  ContentRepositoryDTO,
  NewsRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/newsletter-repository";
import { InputWithPagination } from "../../../../domain/use-cases/helpers/dto";
import { DATABASES_NAMES } from "../../../../shared/db/tableNames";
import { newsletterDb } from "../connection/knexfile";
import { withPagination } from "./mapper/WithPagination";

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
      .into(DATABASES_NAMES.NEWSLETTER.NEWS);

    const id = result.length && result[0].Id;

    return id;
  }
  async update(
    request: ContentRepositoryDTO.Update.Request
  ): ContentRepositoryDTO.Update.Response {
    const result = await newsletterDb(DATABASES_NAMES.NEWSLETTER.NEWS)
      .where({
        Id: request.Id,
      })
      .update({
        Fk_Sender: request.FK_Author,
        Title: request.Title,
        Description: request.Description,
        Content: request.Data,
      });
  }
  async delete(
    request: ContentRepositoryDTO.Delete.Request
  ): ContentRepositoryDTO.Delete.Response {
    await newsletterDb(DATABASES_NAMES.NEWSLETTER.NEWS)
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
          s."Organ" 
      FROM "${DATABASES_NAMES.NEWSLETTER.NEWS}" n 
      INNER JOIN "${DATABASES_NAMES.NEWSLETTER.SENDER}" s 
      ON s."Id" = n."Fk_Sender" 
      WHERE n."Id" = ?
    `,
      [request.Id]
    );

    if (!result) {
      return null;
    }

    return NewsMapper.toDomain(result);
  }
  async getAll(
    request: InputWithPagination
  ): ContentRepositoryDTO.GetAll.Response {
    const result = await newsletterDb.raw(`
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
      FROM "${DATABASES_NAMES.NEWSLETTER.NEWS}" n 
      INNER JOIN "${DATABASES_NAMES.NEWSLETTER.SENDER}" s 
      ON s."Id" = n."Fk_Sender" 
      LIMIT ${request.limit} OFFSET  ${request.pageNumber}
    `);

    if (result.rows.length === 0) {
      return null;
    }

    const data = result.rows.map((row: any) => NewsMapper.toDomain(row));

    return withPagination(data, {
      count: result.rows.length,
      limit: request.limit,
      offset: request.pageNumber,
    });
  }
}
