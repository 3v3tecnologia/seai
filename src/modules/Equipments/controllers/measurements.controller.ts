import {
  badRequest,
  created,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { IEquipmentsMeasurementsServices } from "../services/protocol/measurements";

export class EquipmentsMeasurementsControllers {
  constructor(
    private equipmentsMeasurementsServices: IEquipmentsMeasurementsServices
  ) {}

  async getByEquipmentsCodesAndDate(request: {
    codes: Array<string>;
    date: string;
    type: "station" | "pluviometer";
  }): Promise<HttpResponse> {
    try {
      const codesOrError =
        await this.equipmentsMeasurementsServices.getByEquipmentsCodesAndDate(
          request.type,
          request.codes,
          request.date
        );

      if (codesOrError.isLeft()) {
        return badRequest(codesOrError.value);
      }
      return created(codesOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  async bulkInsert(request: {
    type: "station" | "pluviometer";
    items: Array<any>;
    id_organ: number;
    date: string;
  }): Promise<HttpResponse> {
    try {
      const successOrError =
        await this.equipmentsMeasurementsServices.bulkInsert(request);

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return created(successOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}
