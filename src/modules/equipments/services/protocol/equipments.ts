import { Either } from "../../../../shared/Either";

export interface IEquipmentsServices {
  bulkInsert(
    equipments: Array<any>,
    id_organ: number
  ): Promise<Either<Error, Array<{ Code: string; Id: number }>>>;

  getAllEquipmentsTypes(): Promise<
    Either<
      Error,
      Array<{
        Type: string;
        Name: number;
      }>
    >
  >;

  getByType(
    type: "station" | "pluviometer"
  ): Promise<Either<Error, Array<any> | null>>;

  getMeteorologicalOrganCredentials(
    organName: string
  ): Promise<Either<Error, any | null>>;

  getDateOfLastMeasurementTaken(): Promise<Either<Error, Array<any> | null>>;
}
