import {
  badRequest,
  created,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { IEquipmentsServices } from "../services/protocol/equipments";

export class EquipmentsControllers {
  constructor(private equipmentsServices: IEquipmentsServices) {}

  async getDateOfLastMeasurementTaken(): Promise<HttpResponse> {
    try {
      const lastMeasurementsTaken =
        await this.equipmentsServices.getDateOfLastMeasurementTaken();

      return ok(lastMeasurementsTaken.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  async getAll(request: {
    type: "station" | "pluviometer";
  }): Promise<HttpResponse> {
    try {
      const equipmentsOrError = await this.equipmentsServices.getByType(
        request.type
      );

      if (equipmentsOrError.isLeft()) {
        return badRequest(equipmentsOrError.value);
      }

      return ok(equipmentsOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  async bulkInsert(request: {
    id_organ: number;
    items: Array<{
      IdEquipmentExternal: string;
      Name: string;
      Altitude: number | null;
      Location: {
        Latitude: number;
        Longitude: number;
      } | null;
      FK_Organ: number;
      FK_Type: number;
      Enabled: number;
    }>;
  }): Promise<HttpResponse> {
    try {
      const successOrError = await this.equipmentsServices.bulkInsert(
        request.items,
        request.id_organ
      );

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return created(successOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  async getAllEquipmentsTypes(): Promise<HttpResponse> {
    try {
      const typesOrError =
        await this.equipmentsServices.getAllEquipmentsTypes();

      if (typesOrError.isLeft()) {
        return badRequest(typesOrError.value);
      }

      return ok(typesOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  async getMeteorologicalOrganAccessCredentials(request: {
    organName: string;
  }): Promise<HttpResponse> {
    try {
      const credentialsOrError =
        await this.equipmentsServices.getMeteorologicalOrganCredentials(
          request.organName
        );

      if (credentialsOrError.isLeft()) {
        return badRequest(credentialsOrError.value);
      }

      return ok(credentialsOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
