import { ApiKey } from "../api-key";

export class ApiKeyMapper {
  private constructor() {}

  static toDomain(raw: any): ApiKey {
    return {
      Id: raw.Id || null,
      Type: raw.Type,
      Enabled: raw.Enabled,
      Key: raw.Key,
      CreatedAt: raw.CreatedAt,
      UpdatedAt: raw.UpdatedAt,
    };
  }
}
