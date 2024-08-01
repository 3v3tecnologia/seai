import { Either, right } from "../../../shared/Either";
import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class DeleteEquipment {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: DeleteEquipmentUseCaseProtocol.Request
  ): Promise<Either<Error, DeleteEquipmentUseCaseProtocol.Response>> {
    const { IdEquipment } = request;

    const result = await this.equipmentsRepository.deleteEquipment(IdEquipment);

    const hasDeleted = result > 0;

    if (hasDeleted) {
      return right(`Equipamento ${IdEquipment} deletado com sucesso.`);
    }

    return right(
      `Nenhum equipamento com identicação ${IdEquipment} encontrado.`
    );
  }
}

export namespace DeleteEquipmentUseCaseProtocol {
  export type Request = {
    IdEquipment: number;
  };
  export type Response = string;
}
