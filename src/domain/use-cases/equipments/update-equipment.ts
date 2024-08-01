import { UserCommandOperationProps } from "../../../modules/UserOperations/protocols/logger";
import { Either, left, right } from "../../../shared/Either";

import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class UpdateEquipment implements UpdateEquipmentUseCaseProtocol {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: {
      IdEquipment: number;
      Enable: boolean;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>> {
    const notFound =
      (await this.equipmentsRepository.checkIfEquipmentIdExists(
        request.IdEquipment
      )) === false;

    if (notFound) {
      return left(new Error(`Equipamento não encontrado`));
    }

    await this.equipmentsRepository.enableEquipment(
      {
        IdEquipment: request.IdEquipment,
        Enable: request.Enable,
      },
      operation
    );

    return right(`Sucesso ao atualizar equipamento ${request.IdEquipment}.`);
  }
}

export interface UpdateEquipmentUseCaseProtocol {
  execute(
    request: {
      IdEquipment: number;
      Enable: boolean;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>>;
}
