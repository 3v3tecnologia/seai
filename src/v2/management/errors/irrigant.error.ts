export namespace ManagementIrrigantErrors {
  export class StationMeasurementsNotFound extends Error {
    constructor() {
      super("Não há dados das últimas medições da estação.");
      this.name = "StationMeasurementsNotFound";
    }
  }
  export class PluviometerMeasurementsNotFound extends Error {
    constructor() {
      super("Não há dados das últimas medições do pluviômetro.");
      this.name = "PluviometerMeasurementsNotFound";
    }
  }
}
