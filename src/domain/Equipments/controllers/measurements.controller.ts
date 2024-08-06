import { UserOperationControllerDTO } from "../../../@types/login-user";
import {
  IPaginationInput,
  parsePaginationInput,
} from "../../../shared/utils/pagination";

import { Notification } from "../../../shared/notification/notification";
import { equipmentsMeasurementsService } from "../services";
import {
  updatePluviometerMeasurements,
  updateStationMeasurements,
} from "./schemas/measurements";
import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  created,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";

export class EquipmentsMeasurementsControllers {
  static async getByEquipmentsCodesAndDate(request: {
    codes: Array<string>;
    date: string;
    type: "station" | "pluviometer";
  }): Promise<HttpResponse> {
    try {
      const codesOrError =
        await equipmentsMeasurementsService.getByEquipmentsCodesAndDate(
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

  static async bulkInsert(request: {
    type: "station" | "pluviometer";
    items: Array<any>;
    id_organ: number;
    date: string;
  }): Promise<HttpResponse> {
    try {
      const successOrError = await equipmentsMeasurementsService.bulkInsert(
        request
      );

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return created(successOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  // FetchLatestEquipmentMeasurementsController
  static async fetchLatest(request: {
    id: number;
    type: "station" | "pluviometer";
  }) {
    try {
      const errors = new Notification();

      if (request.id === undefined || request.id === null) {
        errors.addError(
          new Error(
            "É necessário informar o Id da leitura do equipamento, e o valor deve ser numérico"
          )
        );
      }

      if (request.type === undefined || request.type === null) {
        errors.addError(
          new Error(
            "É necessário informar o tipo de equipamento e o valor deve ser 'station' ou 'pluviometer'"
          )
        );
      }

      if (errors.hasErrors()) {
        return badRequest(new Error(errors.messages()));
      }

      const result = await equipmentsMeasurementsService.fetchLatest({
        id: request.id,
        type: request.type,
      });

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async fetchByPluviometer(
    request: {
      idEquipment: number;
      start?: string;
      end?: string | null;
    } & IPaginationInput
  ) {
    try {
      const errors = new Notification();

      if (request.idEquipment === undefined || request.idEquipment === null) {
        errors.addError(
          new Error(
            "É necessário informar o Id do equipamento, e o valor deve ser numérico"
          )
        );
      }

      if (errors.hasErrors()) {
        return badRequest(new Error(errors.messages()));
      }

      const dto = {
        idEquipment: request.idEquipment,
        ...parsePaginationInput({
          page: request.pageNumber,
          limit: request.limit,
        }),
      };

      if (request.start) {
        Object.assign(dto, {
          time: {
            start: request.start,
            end: request.end || null,
          },
        });
      }

      const result = await equipmentsMeasurementsService.fetchByPluviometer(
        dto
      );

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async fetchByStation(
    request: {
      idEquipment: number;
      start?: string;
      end?: string | null;
    } & IPaginationInput
  ) {
    try {
      const errors = new Notification();

      if (request.idEquipment === undefined || request.idEquipment === null) {
        errors.addError(
          new Error(
            "É necessário informar o Id do equipamento, e o valor deve ser numérico"
          )
        );
      }

      if (errors.hasErrors()) {
        return badRequest(new Error(errors.messages()));
      }

      const dto = {
        idEquipment: request.idEquipment,
        ...parsePaginationInput({
          page: request.pageNumber,
          limit: request.limit,
        }),
      };

      if (request.start) {
        Object.assign(dto, {
          time: {
            start: request.start,
            end: request.end || null,
          },
        });
      }

      const result = await equipmentsMeasurementsService.fetchByStation(dto);

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async updateByStation({
    id,
    accountId,
    Operation,
    AtmosphericPressure,
    AverageAtmosphericTemperature,
    AverageRelativeHumidity,
    MaxAtmosphericTemperature,
    MaxRelativeHumidity,
    MinAtmosphericTemperature,
    MinRelativeHumidity,
    TotalRadiation,
    WindVelocity,
  }: {
    id: number;
    TotalRadiation: number | null;
    AverageRelativeHumidity: number | null;
    MinRelativeHumidity: number | null;
    MaxRelativeHumidity: number | null;
    AverageAtmosphericTemperature: number | null;
    MaxAtmosphericTemperature: number | null;
    MinAtmosphericTemperature: number | null;
    AtmosphericPressure: number | null;
    WindVelocity: number | null;
  } & UserOperationControllerDTO) {
    try {
      const measurements = {
        AtmosphericPressure,
        AverageAtmosphericTemperature,
        AverageRelativeHumidity,
        MaxAtmosphericTemperature,
        MaxRelativeHumidity,
        MinAtmosphericTemperature,
        MinRelativeHumidity,
        TotalRadiation,
        WindVelocity,
      };

      const { error } = await updateStationMeasurements.validate({
        id,
        accountId,
        Operation,
        ...measurements,
      });

      if (error) {
        return badRequest(error);
      }

      const resultOrError = await equipmentsMeasurementsService.updateByStation(
        {
          IdRead: Number(id),
          ...measurements,
        },
        {
          author: accountId,
          operation: Operation,
        }
      );

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      return ok(resultOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async updateByPluviometer({
    id,
    accountId,
    Operation,
    Precipitation,
  }: {
    id: number;
    Precipitation: number | null;
  } & UserOperationControllerDTO) {
    try {
      const { error } = await updatePluviometerMeasurements.validate({
        id: id,
        Precipitation: Precipitation,
        accountId,
        Operation,
      });

      if (error) {
        return badRequest(error);
      }

      const resultOrError =
        await equipmentsMeasurementsService.updateByPluviometer(
          {
            IdRead: id,
            Precipitation,
          },
          {
            author: accountId,
            operation: Operation,
          }
        );

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      return ok(resultOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}
