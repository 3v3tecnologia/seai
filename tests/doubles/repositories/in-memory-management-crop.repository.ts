import {
  ManagementCrop,
  ManagementCropParams,
} from "../../../src/domain/entities/management/management-crop";
import { ManagementCropRepository } from "../../../src/domain/use-cases/_ports/repositories/management-crop-repository";

/*
export class InMemoryManagementCropRepository
  implements ManagementCropRepository
{
  private _data: Array<ManagementCrop> = [];
  private idCount: number = 0;

  constructor(data: Array<ManagementCrop>) {
    this._data = data;
  }

  async find(): Promise<ManagementCropParams[] | null> {
    throw new Error("Method not implemented.");
  }

  public get data() {
    return this._data;
  }

  async update(culture: ManagementCrop): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async create(culture: ManagementCrop): Promise<number | null> {
    culture.id = this.idCount;

    this.idCount++;

    this._data.push(culture);

    return this.idCount;
  }

  async exists(crop: string | Number): Promise<boolean> {
    if (typeof crop === "number") {
      return this._data.some((culture) => culture.id === crop);
    }

    return this._data.some((culture) => culture.name === crop);
  }

  async delete(id: number): Promise<void> {
    this._data.splice(
      this._data.findIndex((culture) => culture.id === id),
      1
    );
  }

  async findCropById(id: number): Promise<ManagementCrop | null> {
    const culture = this._data.find((culture) => culture.id === id);

    return culture || null;
  }
  async findCropByName(name: string): Promise<ManagementCrop | null> {
    const culture = this._data.find((culture) => culture.name === name);

    return culture || null;
  }
}
*/
