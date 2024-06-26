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
    const notFound =
      await this.equipmentsRepository.checkIfEquipmentIdExists(
        request.IdEquipment
      ) === false;

    /*const hasOtherEquipmentWithSameCode =
      existingEquipmentId !== null &&
      Number(request.IdEquipment) !== existingEquipmentId;*/

    if (notFound) {
      return left(new Error(`Equipamento não encontrado`));
    }

    /*const isOrganAlreadyExists =
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
    */

    await this.equipmentsRepository.updateEquipment({
      IdEquipment: request.IdEquipment,
      Enable: request.Enable
      // Fk_Organ: request.Fk_Organ,
      // Fk_Type: request.Fk_Type,
      // IdEquipmentExternal: request.IdEquipmentExternal,
      // Location: request.Location,
      // Altitude: request.Altitude,
      // Name: request.Name,
    });

    this.addLog({
      action: "update",
      table: "MetereologicalEquipment",
      description: `Sucesso ao atualizar equipamento ${request.IdEquipment}.`,
    });

    return right(`Sucesso ao atualizar equipamento ${request.IdEquipment}.`);
  }
}

export namespace UpdateEquipmentUseCaseProtocol {
  export type Request = {
    IdEquipment: number;
    /*IdEquipmentExternal: string;
    Name: string;
    Fk_Organ: number;
    Fk_Type: number;
    Altitude: number;
    Location: {
      Name: string;
      Coordinates: Array<number>;
    };*/
    Enable: boolean;
  };
  export type Response = string;
}
