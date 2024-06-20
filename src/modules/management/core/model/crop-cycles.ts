import { Either, left, right } from "../../../../shared/Either";

export type ManagementCropCycle = {
  Title: string;
  // DurationInDays: number;
  Start: number;
  End: number;
  KC: number;
  Increment: number;
};


export function checkCropCycleSequence(cycles: Array<ManagementCropCycle>): Either<Error, void> {
  for (let i = 0; i < cycles.length; i++) {
    const current = cycles[i]

    if (current.Start < 0) {
      return left(new Error("Data de início do ciclo não pode ser negativa"));
    }

    if (current.Start > current.End) {
      return left(new Error("Data de início do ciclo não pode ser superior a data final do ciclo"));
    }

    if (current.Start === current.End) {
      return left(new Error("Data de início do ciclo não pode ser igual a data final do ciclo"));
    }

    const hasPreviousCycle = i > 0

    if (hasPreviousCycle) {
      const previous = cycles[i - 1]
      if (current.Start !== previous.End + 1) {
        return left(new Error("O início de um ciclo tem que ser a sequencia do final do ciclo anterior"));
      }
    }

  }

  return right();
}

export function findKc(cropDate: number, cropCycles: Array<ManagementCropCycle>): Either<Error, ManagementCropCycle> {
  const startCropCycle = cropCycles[0]

  if (cropDate < startCropCycle.Start) {
    return left(new Error(`Necessário ajustar a data plantio pois o valor encontra-se ${startCropCycle.Start - cropDate} dia(s) anterior a data de início do ciclo da cultura. `))
  }

  const endCropCycle = cropCycles[cropCycles.length - 1]

  if (cropDate > endCropCycle.End) {
    return left(new Error(`Necessário ajustar a data plantio pois o valor encontra-se após a data do último dia do ciclo da cultura`))
  }

  const data = cropCycles.find(
    (cycle) => cropDate >= cycle.Start && cropDate <= cycle.End
  )

  if (data) {
    return right(data)
  }

  return left(new Error("Não foi possível encontrar valores de KC"))
}