import { Either } from "../../../../shared/Either";

export interface IEquipmentsMeasurementsServices {
  getByEquipmentsCodesAndDate(
    eqpType: "station" | "pluviometer",
    codes: Array<string>,
    date: string
  ): Promise<Either<Error, Array<string>>>;

  bulkInsert(params: {
    type: "station" | "pluviometer";
    date: string;
    items: Array<any>;
    id_organ: number;
  }): Promise<Either<Error, string>>;
}
