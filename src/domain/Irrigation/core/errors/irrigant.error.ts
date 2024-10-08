export namespace IrrigantErrors {
  export class StationMeasurementsNotFound extends Error {
    constructor() {
      super("Não há dados das últimas medições de Et0 da estação.");
      this.name = "StationMeasurementsNotFound";
    }
  }
  export class PluviometerMeasurementsNotFound extends Error {
    constructor() {
      super("Não há dados das últimas medições do pluviômetro.");
      this.name = "PluviometerMeasurementsNotFound";
    }
  }
  export class CropDateNotFound extends Error {
    constructor() {
      super("Não há dados de KC.");
      this.name = "PluviometerMeasurementsNotFound";
    }
  }
  export class IrrigationSystemNotRecognized extends Error {
    constructor() {
      super("Tipo de sistema não reconhecido.");
      this.name = "IrrigationSystemNotRecognized";
    }
  }
}
