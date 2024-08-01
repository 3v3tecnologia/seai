import { Either, left, right } from "../../../shared/Either";

import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class CreateEquipments {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: CreateEquipmentUseCaseProtocol.Request
  ): Promise<Either<Error, CreateEquipmentUseCaseProtocol.Response>> {
    const hasEquipmentWithSameCode =
      await this.equipmentsRepository.checkIfEquipmentCodeAlreadyExists(
        request.IdEquipmentExternal
      );

    if (hasEquipmentWithSameCode === true) {
      return left(new Error(`Código de equipamento já existente.`));
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

    return right();
  }
}

export namespace CreateEquipmentUseCaseProtocol {
  export type Request = {
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
  };

  export type Response = number | null;
}
