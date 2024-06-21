export namespace ManagementCropErrors {
  export class CropAlreadyExistsError extends Error {
    constructor(culture: string) {
      super(`Cultura ${culture} de manejo já existe`);
      this.name = "CropAlreadyExistsError";
    }
  }

  export class CropNotExistsError extends Error {
    constructor() {
      super("Cultura de manejo não existe");
      this.name = "CropNotExistsError";
    }
  }
  export class CropCyclesError extends Error {
    constructor() {
      super("Não há dados de KC da cultura.");
      this.name = "CropCyclesError";
    }
  }
  export class KcNotFound extends Error {
    constructor() {
      super("Não foi possível encontrar valores de KC");
      this.name = "CropCyclesNotFoundError";
    }
  }
  export class PlantingDateIsBeforeThanCropCycleStartDate extends Error {
    constructor(diff: number) {
      super(
        `Necessário ajustar a data plantio pois o valor encontra-se ${diff} dia(s) anterior a data de início do ciclo da cultura.`
      );
      this.name = "PlantingDateIfBeforeThanCropCycle";
    }
  }
  export class PlantingDateIsAfterThanCropCycleEndDate extends Error {
    constructor() {
      super(
        `Necessário ajustar a data plantio pois o valor encontra-se após a data do último dia do ciclo da cultura`
      );
      this.name = "PlantingDateIfAfterThanCropCycleEndDate";
    }
  }
}
