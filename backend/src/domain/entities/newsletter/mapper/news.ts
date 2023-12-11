import { Content } from "../news";

export class NewsMapper {
  static toDomain(row: any): Content {
    return {
      Id: row.Id,
      Author: {
        Id: row.Fk_Sender,
        Email: row.Email,
        Organ: row.Organ,
      },
      Title: row.Title,
      Description: row.Description,
      Data: row.Content,
      CreatedAt: row.CreatedAt,
      UpdatedAt: row.UpdatedAt,
    };
  }
}
