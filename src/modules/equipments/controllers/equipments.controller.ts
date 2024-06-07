import {
  badRequest,
  created,
  ok,
  serverError
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { EquipmentsServices } from "../services/equipments";

export class EquipmentsControllers {
  static async getDateOfLastMeasurementTaken(): Promise<HttpResponse> {
    try {
      const lastMeasurementsTaken = await EquipmentsServices.getDateOfLastMeasurementTaken()

      return ok(lastMeasurementsTaken.value)
    } catch (error) {
      return serverError(error as Error);
    }
  }
  static async getAll(request: { type: 'station' | 'pluviometer' }): Promise<HttpResponse> {
    try {
      const equipmentsOrError = await EquipmentsServices.getByType(request.type)

      if (equipmentsOrError.isLeft()) {
        return badRequest(equipmentsOrError.value)
      }

      return ok(equipmentsOrError.value);

    } catch (error) {
      return serverError(error as Error);
    }
  }
  static async bulkInsert(request: {
    id_organ: number,
    items: Array<{
      IdEquipmentExternal: string,
      Name: string,
      Altitude: number | null,
      Location: {
        Latitude: number,
        Longitude: number
      } | null,
      FK_Organ: number,
      FK_Type: number,
      Enabled: number
    }>
  }): Promise<HttpResponse> {
    try {
      const successOrError = await EquipmentsServices.bulkInsert(request.items, request.id_organ)

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value)
      }

      return created(successOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async getAllEquipmentsTypes(): Promise<HttpResponse> {
    try {
      const typesOrError = await EquipmentsServices.getAllEquipmentsTypes()

      if (typesOrError.isLeft()) {
        return badRequest(typesOrError.value)
      }

      return ok(typesOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async getMeteorologicalOrganAccessCredentials(request: { organName: string }): Promise<HttpResponse> {
    try {
      const credentialsOrError = await EquipmentsServices.getMeteorologicalOrganCredentials(request.organName)

      if (credentialsOrError.isLeft()) {
        return badRequest(credentialsOrError.value)
      }

      return ok(credentialsOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
