import { Either, right } from "../../../shared/Either";
import { Command } from "../_ports/core/command";
import { EquipmentsRepositoryProtocol } from "../_ports/repositories/equipments-repository";

export class DeleteEquipment extends Command {
  private readonly equipmentsRepository: EquipmentsRepositoryProtocol;

  constructor(equipmentsRepository: EquipmentsRepositoryProtocol) {
    super();
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: DeleteEquipmentUseCaseProtocol.Request
  ): Promise<Either<Error, DeleteEquipmentUseCaseProtocol.Response>> {
    const { IdEquipment } = request;

    const result = await this.equipmentsRepository.deleteEquipment(IdEquipment);

    const hasDeleted = result > 0;
    console.log("[DELETE] : Equipment", { result });

    if (hasDeleted) {
      this.addLog({
        action: "delete",
        table: "MetereologicalEquipment",
        description: `Equipamento ${IdEquipment} deletado com sucesso.`,
      });

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
