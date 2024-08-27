import { Subscriber } from "../subscriber";

export class NewsSubscriberMapper {
  static toDomain(row: any): Required<Subscriber> {
    return {
      Id: row.Id,
      Email: row.Email,
      CreatedAt: row.CreatedAt,
      UpdatedAt: row.UpdatedAt,
    };
  }
}
