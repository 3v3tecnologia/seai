import { Either, left, right } from "../../../../shared/Either";

export type ManagementCropCycle = {
  Id?: number;
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

