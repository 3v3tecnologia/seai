import { UserCommandOperationProps } from "../../../modules/UserOperations/protocols/logger";
import { Either, left, right } from "../../../shared/Either";

import { IEquipmentsMeasuresRepository } from "../_ports/repositories/equipments-measurements.repository";

export class UpdatePluviometerMeasures {
  private readonly equipmentsRepository: IEquipmentsMeasuresRepository;

  constructor(equipmentsRepository: IEquipmentsMeasuresRepository) {
    this.equipmentsRepository = equipmentsRepository;
  }
  async execute(
    request: {
      IdRead: number;
      Precipitation: number | null;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>> {
    const measureExists =
      await this.equipmentsRepository.checkIfPluviometerMeasurementsExists({
        id: request.IdRead,
      });

    if (measureExists === null) {
      return left(new Error("Medição não encontrada"));
    }

    await this.equipmentsRepository.updatePluviometerMeasures(
      request,
      operation
    );

    return right(
      `Sucesso ao atualizar leitura de pluviômetro ${request.IdRead}.`
    );
  }
}

export interface UpdatePluviometerMeasuresUseCaseProtocol {
  execute(request: {
    IdRead: number;
    Precipitation: number | null;
  }): Promise<Either<Error, string>>;
}
