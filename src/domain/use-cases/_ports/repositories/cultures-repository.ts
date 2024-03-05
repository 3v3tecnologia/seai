import { ManagementCultureDTO } from "../../management/dto/management-culture-dto";

export interface ManagementCulturesRepository {
  create(culture: ManagementCultureDTO): Promise<ManagementCultureDTO>;

  exists(name: string): Promise<boolean>;

  delete(idCulture: number): Promise<void>;

  findAllByBasin(idBasin: number): Promise<Array<ManagementCultureDTO> | null>;

  findCultureById(id: number): Promise<ManagementCultureDTO | null>;

  findCultureByName(name: string): Promise<ManagementCultureDTO | null>;
}
