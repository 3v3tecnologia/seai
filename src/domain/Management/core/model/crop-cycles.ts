import { Either, left, right } from "../../../../shared/Either";
import { ManagementCropErrors } from "../errors/crop-errors";

export type ManagementCropCycle = {
  Title: string;
  // DurationInDays: number;
  Start: number;
  End: number;
  KC: number;
  Increment: number;
};

export function checkCropCycleSequence(
  cycles: Array<ManagementCropCycle>
): Either<Error, void> {
  for (let i = 0; i < cycles.length; i++) {
    const current = cycles[i];

    if (current.Start < 0) {
      return left(new Error("Data de início do ciclo não pode ser negativa"));
    }

    if (current.Start > current.End) {
      return left(
        new Error(
          "Data de início do ciclo não pode ser superior a data final do ciclo"
        )
      );
    }

    if (current.Start === current.End) {
      return left(
        new Error(
          "Data de início do ciclo não pode ser igual a data final do ciclo"
        )
      );
    }

    const hasPreviousCycle = i > 0;

    if (hasPreviousCycle) {
      const previous = cycles[i - 1];
      if (current.Start !== previous.End + 1) {
        return left(
          new Error(
            "O início de um ciclo tem que ser a sequencia do final do ciclo anterior"
          )
        );
      }
    }
  }

  return right();
}

export function findKc(
  cropDate: number,
  cropCycles: Array<ManagementCropCycle>,
  cycleRestartPoint: string
): Either<Error, ManagementCropCycle> {
  const startCropCycle = cropCycles[0];

  if (cropDate < startCropCycle.Start) {
    return left(
      new ManagementCropErrors.PlantingDateIsBeforeThanCropCycleStartDate(
        startCropCycle.Start - cropDate
      )
    );
  }

  const endCropCycle = cropCycles[cropCycles.length - 1];

  if (cropDate > endCropCycle.End) {
    // Se for cultura perene então deverá buscar os dados de KC
    // a partir do ponto de início do ciclo de desenvolvimento especificado.
    if (cycleRestartPoint) {
      const data = cropCycles.find(
        (cycle) => cycle.Title === cycleRestartPoint
      );

      if (data) return right(data);
    }

    return left(
      new ManagementCropErrors.PlantingDateIsAfterThanCropCycleEndDate()
    );
  }

  const data = cropCycles.find(
    (cycle) => cropDate >= cycle.Start && cropDate <= cycle.End
  );

  if (data) {
    return right(data);
  }

  return left(new ManagementCropErrors.KcNotFound());
}
