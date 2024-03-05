import { ManagementCulture } from "../../../src/domain/entities/management/management-culture";
import { ManagementCulturesRepository } from "../../../src/domain/use-cases/_ports/repositories/cultures-repository";
import { ManagementCultureDTO } from "../../../src/domain/use-cases/management/dto/management-culture-dto";

export class InMemoryCultures implements ManagementCulturesRepository {
  private _data: Array<ManagementCultureDTO> = [];
  private idCount: number = 0;

  constructor(data: Array<ManagementCultureDTO>) {
    this._data = data;
  }

  public get data() {
    return this._data;
  }

  async create(culture: ManagementCultureDTO): Promise<ManagementCultureDTO> {
    culture.id = this.idCount;

    this.idCount++;

    this._data.push(culture);

    return culture;
  }

  async exists(name: string): Promise<boolean> {
    return this._data.some((culture) => culture.name === name);
  }

  async delete(id: number): Promise<void> {
    this._data.splice(
      this._data.findIndex((culture) => culture.id === id),
      1
    );
  }

  async findAllByBasin(
    basin: number
  ): Promise<Array<ManagementCultureDTO> | null> {
    const data = this._data.filter((culture) => culture.idBasin === basin);

    return data || null;
  }

  async findCultureById(id: number): Promise<ManagementCultureDTO | null> {
    const culture = this._data.find((culture) => culture.id === id);

    return culture || null;
  }
  async findCultureByName(name: string): Promise<ManagementCultureDTO | null> {
    const culture = this._data.find((culture) => culture.name === name);

    return culture || null;
  }
}
