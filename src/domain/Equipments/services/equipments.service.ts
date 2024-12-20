import { Either, left, right } from "../../../shared/Either";
import { PaginatedInput } from "../../../shared/utils/command";
import {
  IOutputWithPagination
} from "../../../shared/utils/pagination";
import { EquipmentEntity } from "../core/models/Equipment";
import { EquipmentsTypes } from "../core/models/equipments-types";
import { MeteorologicalOrganEntity } from "../core/models/MetereologicalOrgan";
import { IEquipmentsRepository } from "../infra/repository/protocols/equipment";
import { AuditableInput } from './../../../shared/utils/command';
import { IEquipmentsServices } from "./protocol/equipments";

export class EquipmentsServices implements IEquipmentsServices {
  constructor(private equipmentRepository: IEquipmentsRepository) { }

  async insert(request: {
    IdEquipmentExternal: string;
    Name: string;
    Fk_Organ: number;
    Fk_Type: number;
    Altitude: number;
    Location: {
      Name: string;
      Coordinates: Array<number>;
    };
    Enable: boolean;
  }): Promise<Either<Error, number | null>> {
    const hasEquipmentWithSameCode =
      await this.equipmentRepository.checkIfEquipmentCodeAlreadyExists(
        request.IdEquipmentExternal
      );

    if (hasEquipmentWithSameCode === true) {
      return left(new Error(`Código de equipamento já existente.`));
    }

    const isOrganAlreadyExists =
      await this.equipmentRepository.checkIfOrganExists(request.Fk_Organ);

    if (isOrganAlreadyExists === false) {
      return left(new Error(`Órgão não existe.`));
    }

    const isEquipmentTypeAlreadyExists =
      await this.equipmentRepository.checkIfEquipmentTypeExists(
        request.Fk_Type
      );

    if (isEquipmentTypeAlreadyExists === false) {
      return left(new Error(`Tipo de equipamento não existe.`));
    }

    return right();
  }

  async bulkInsert(
    equipments: Array<any>,
    id_organ: number
  ): Promise<Either<Error, Array<{ Code: string; Id: number }>>> {
    if (!equipments.length) {
      return left(new Error("Necessário informar alguma leitura"));
    }
    const codes = await this.equipmentRepository.bulkInsert(equipments);

    await this.equipmentRepository.insertLastUpdatedAtByOrgan(id_organ);

    return right(codes);
  }

  async getAllEquipmentsTypes(): Promise<
    Either<
      Error,
      Array<{
        Type: string;
        Name: number;
      }>
    >
  > {
    return right(await this.equipmentRepository.getTypes());
  }

  async getByType(
    type: `${EquipmentsTypes}`
  ): Promise<Either<Error, Array<any> | null>> {
    return right(await this.equipmentRepository.getByType(type));
  }

  async getAll(
    request: PaginatedInput<{
      equipmentId?: number;
      idOrgan?: number;
      idType?: number;
      name?: string;
      enabled?: boolean;
      only_with_measurements?: boolean;
    }>
  ): Promise<
    Either<
      Error,
      IOutputWithPagination<EquipmentEntity> | EquipmentEntity | null
    >
  > {
    const { data, paginate } = request

    if (data.equipmentId) {
      const equipment = await this.equipmentRepository.getEquipmentId(
        data.equipmentId
      );
      return right(equipment);
    }

    const result = await this.equipmentRepository.getAll({
      data,
      paginate
    });

    return right(result);
  }

  async update(
    { audit, data }: AuditableInput<{
      IdEquipment: number;
      Enable: boolean;
    }>): Promise<Either<Error, string>> {
    const notFound =
      (await this.equipmentRepository.checkIfEquipmentIdExists(
        data.IdEquipment
      )) === false;

    if (notFound) {
      return left(new Error(`Equipamento não encontrado`));
    }

    await this.equipmentRepository.enableEquipment(
      {
        IdEquipment: data.IdEquipment,
        Enable: data.Enable,
      },
      audit
    );

    return right(`Sucesso ao atualizar equipamento ${data.IdEquipment}.`);
  }

  async getMeteorologicalOrgans(): Promise<
    Either<Error, Array<Omit<MeteorologicalOrganEntity, "Password">> | null>
  > {
    return right(await this.equipmentRepository.getMeteorologicalOrgans());
  }

  async fetchWithYesterDayMeasurements(
    request: {
      type: `${EquipmentsTypes}`;
    } & {
      latitude?: number;
      longitude?: number;
      distance?: number;
    }
  ): Promise<Either<Error, Array<any> | null>> {
    let params: {
      latitude: number;
      longitude: number;
      distance?: number;
    } | null = null;

    if (
      [
        Reflect.has(request, "latitude"),
        Reflect.has(request, "longitude"),
      ].every((param) => param == true)
    ) {
      params = {
        latitude: request.latitude as number,
        longitude: request.longitude as number,
        distance: 1000,
      };

      if (Reflect.has(request, "distance") && request.distance) {
        params.distance = request.distance as number;
      }
    }

    switch (request?.type) {
      case "station":
        return right(
          await this.equipmentRepository.getStationsWithYesterdayMeasurements(
            params
          )
        );
      case "pluviometer":
        return right(
          await this.equipmentRepository.getPluviometersWithYesterdayMeasurements(
            params
          )
        );
      default:
        return right(null);
    }
  }

  async getActivatedEquipments(
    request: {
      type: `${EquipmentsTypes}`;
    } & {
      latitude?: number;
      longitude?: number;
      distance?: number;
    }
  ): Promise<Either<Error, Array<any> | null>> {
    let params: {
      latitude: number;
      longitude: number;
      distance?: number;
    } | null = null;

    if (
      [
        Reflect.has(request, "latitude"),
        Reflect.has(request, "longitude"),
      ].every((param) => param == true)
    ) {
      params = {
        latitude: request.latitude as number,
        longitude: request.longitude as number,
        distance: 1000,
      };

      if (Reflect.has(request, "distance") && request.distance) {
        params.distance = request.distance as number;
      }
    }

    switch (request?.type) {
      case "station":
        return right(
          await this.equipmentRepository.getActivatedStations(
            params
          )
        );
      case "pluviometer":
        return right(
          await this.equipmentRepository.getActivatedPluviometers(
            params
          )
        );
      default:
        return right(null);
    }
  }

  async getMeteorologicalOrganCredentials(
    organName: string
  ): Promise<Either<Error, any | null>> {
    return right(await this.equipmentRepository.getOrganByName(organName));
  }

  async getDateOfLastMeasurementTaken(): Promise<
    Either<Error, Array<any> | null>
  > {
    return right(
      await this.equipmentRepository.getDateOfLastMeasurementTaken()
    );
  }
}
