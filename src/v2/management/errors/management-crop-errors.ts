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
}
