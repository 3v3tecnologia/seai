import { Either, left, right } from "../../../shared/Either";
import { Command } from "../_ports/core/command";

import {
  EquipmentsRepositoryProtocol,
} from "../_ports/repositories/equipments-repository";

export class CreateEquipments extends Command {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    super()
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: CreateEquipmentUseCaseProtocol.Request
  ): Promise<Either<Error, CreateEquipmentUseCaseProtocol.Response>> {

    const isOrganAlreadyExists = await  this.equipmentsRepository.checkIfOrganExists(request.Fk_Organ)

    if(isOrganAlreadyExists === false){
        return left(new Error(`Órgão não existe.`))
    }

    const isEquipmentTypeAlreadyExists = await  this.equipmentsRepository.checkIfEquipmentTypeExists(request.Fk_Type)

    if(isEquipmentTypeAlreadyExists=== false){
        return left(new Error(`Tipo de equipamento não existe.`))
    }

    const equipmentId = await this.equipmentsRepository.createEquipment(request);

    return right(`Sucesso ao criar equipamento ${equipmentId}.`);
  }
}

export namespace CreateEquipmentUseCaseProtocol {
  export type Request = {
    IdEquipmentExternal: string;
    Name: string;
    Altitude: number;
    Fk_Organ: number;
    Fk_Type: number;
  };
  export type Response = string;
}
