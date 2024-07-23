import { Content } from "../content";

export class NewsMapper {
  static toDomain(row: any): Content {
    const domain = {
      Id: row.Id,
      Author: {
        Id: row.Fk_Sender,
        Email: row.Email,
        Organ: row.Organ,
      },
      Title: row.Title,
      SentAt: row.SentAt,
      SendDate: row.SendDate,
      Description: row.Description,
      CreatedAt: row.CreatedAt,
      UpdatedAt: row.UpdatedAt,
    };

    if (row.Content) {
      Object.assign(domain, {
        Data: row.Content,
      });
    }

    return domain;
  }
}
