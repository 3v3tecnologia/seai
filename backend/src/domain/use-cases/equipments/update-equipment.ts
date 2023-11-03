import { Either, left, right } from "../../../shared/Either";
import { Command } from "../_ports/core/command";

import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class UpdateEquipment extends Command {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    super();
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: UpdateEquipmentUseCaseProtocol.Request
  ): Promise<Either<Error, UpdateEquipmentUseCaseProtocol.Response>> {
    const existingEquipmentId =
      await this.equipmentsRepository.getEquipmentIdByExternalCode(
        request.IdEquipmentExternal
      );

    const hasOtherEquipmentWithSameCode =
      existingEquipmentId !== null &&
      Number(request.IdEquipment) !== existingEquipmentId;

    if (hasOtherEquipmentWithSameCode) {
      return left(new Error(`Equipamento com código já existente.`));
    }

    const isOrganAlreadyExists =
      await this.equipmentsRepository.checkIfOrganExists(request.Fk_Organ);

    if (isOrganAlreadyExists === false) {
      return left(new Error(`Órgão não existe.`));
    }

    const isEquipmentTypeAlreadyExists =
      await this.equipmentsRepository.checkIfEquipmentTypeExists(
        request.Fk_Type
      );

    if (isEquipmentTypeAlreadyExists === false) {
      return left(new Error(`Tipo de equipamento não existe.`));
    }

    const equipmentId = await this.equipmentsRepository.updateEquipment({
      Fk_Organ: request.Fk_Organ,
      Fk_Type: request.Fk_Type,
      IdEquipment: request.IdEquipment,
      IdEquipmentExternal: request.IdEquipmentExternal,
      Location: request.Location,
      Name: request.Name,
    });

    this.addLog({
      action: "update",
      table: "MetereologicalEquipment",
      description: `Sucesso ao atualizar equipamento ${equipmentId}.`,
    });

    return right(`Sucesso ao atualizar equipamento ${equipmentId}.`);
  }
}

export namespace UpdateEquipmentUseCaseProtocol {
  export type Request = {
    IdEquipment: number;
    IdEquipmentExternal: string;
    Name: string;
    Fk_Organ: number;
    Fk_Type: number;
    Location: {
      Name: string;
      Altitude: number;
      Longitude: number;
      Latitude: number;
    };
  };
  export type Response = string;
}
