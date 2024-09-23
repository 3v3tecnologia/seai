
import { Notification } from "../../../shared/notification/notification";
import { HttpResponse } from "../../../shared/ports/http-response";
import { mapToPaginatedInput } from "../../../shared/utils/command";
import {
  badRequest,
  created,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";
import { equipmentsService } from "../services";
import {
  BulkInsertRequest,
  CreateEquipmentRequest,
  FetchActivatedEquipmentsRequest,
  FetchAllRequest,
  GetAllEquipmentsRequest,
  GetMeteorologicalOrganAccessCredentialRequest,
  GetSyncronizedEquipmentsRequest,
  UpdateEquipmentRequest
} from "./request/equipments";
import { updateEquipment } from "./schemas/equipment-validator";

export class EquipmentsControllers {
  static async getDateOfLastMeasurementTaken(): Promise<HttpResponse> {
    try {
      const lastMeasurementsTaken =
        await equipmentsService.getDateOfLastMeasurementTaken();

      return ok(lastMeasurementsTaken.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async getAll(request: GetAllEquipmentsRequest): Promise<HttpResponse> {
    try {
      const equipmentsOrError = await equipmentsService.getByType(request.type);

      if (equipmentsOrError.isLeft()) {
        return badRequest(equipmentsOrError.value);
      }

      return ok(equipmentsOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async bulkInsert(request: BulkInsertRequest): Promise<HttpResponse> {
    try {
      const successOrError = await equipmentsService.bulkInsert(
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

  static async getAllEquipmentsTypes(): Promise<HttpResponse> {
    try {
      const typesOrError = await equipmentsService.getAllEquipmentsTypes();

      if (typesOrError.isLeft()) {
        return badRequest(typesOrError.value);
      }

      return ok(typesOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async getMeteorologicalOrganAccessCredentials(
    request: GetMeteorologicalOrganAccessCredentialRequest
  ): Promise<HttpResponse> {
    try {
      const credentialsOrError =
        await equipmentsService.getMeteorologicalOrganCredentials(
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

  static async create(request: CreateEquipmentRequest) {
    try {
      const resultOrError = await equipmentsService.insert({
        Name: request.Name,
        Fk_Organ: request.Fk_Organ,
        Fk_Type: request.Fk_Type,
        IdEquipmentExternal: request.IdEquipmentExternal,
        Altitude: request.Altitude,
        Location: request.Location,
        Enable: request.Enable,
      });

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      return ok(resultOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async getActivatedEquipments(
    request: FetchActivatedEquipmentsRequest
  ) {
    try {
      const errors = new Notification();
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
      const result = await equipmentsService.getActivatedEquipments(
        request
      );

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async getSyncronizedEquipments(
    request: GetSyncronizedEquipmentsRequest
  ) {
    try {
      const errors = new Notification();
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
      const result = await equipmentsService.fetchWithYesterDayMeasurements(
        request
      );

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async fetchAll(request: FetchAllRequest) {
    try {
      const dto = {};

      if (request.idOrgan) {
        Object.assign(dto, {
          idOrgan: request.idOrgan,
        });
      }

      if (request.name) {
        Object.assign(dto, {
          name: request.name,
        });
      }

      if (request.idType) {
        Object.assign(dto, {
          idType: request.idType,
        });
      }

      if (request.enabled) {
        Object.assign(dto, {
          enabled: request.enabled,
        });
      }

      if (request.only_with_measurements && request.idType) {
        Object.assign(dto, {
          only_with_measurements: request.only_with_measurements === "true",
        });
      }

      const result = await equipmentsService.getAll(mapToPaginatedInput(dto, {
        limit: request.limit,
        offset: request.offset,
        pageNumber: request.pageNumber
      }));

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async fetchMeteorologicalOrgan() {
    try {
      const result = await equipmentsService.getMeteorologicalOrgans();

      return ok(result.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async update(request: UpdateEquipmentRequest) {
    try {
      const { Enable, accountId, Operation, id } = request;

      const { error } = await updateEquipment.validate({
        Enable,
        accountId,
        Operation,
        id,
      });

      if (error) {
        return badRequest(error);
      }

      const resultOrError = await equipmentsService.update(
        {
          data: {
            IdEquipment: id,
            Enable,
          },
          audit: {
            author: accountId,
            operation: Operation,
          }
        }
      );

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      return ok(resultOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
