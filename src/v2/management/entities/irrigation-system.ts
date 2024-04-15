import {
  IrrigationSystemMeasurementsEntity,
  MicroSprinklingOrDrippingProps,
  PivotProps,
  SprinklingProps,
  SulcosProps,
} from "./irrigation-system-measurements";

export enum irrigationsTypesNames {
  Sprinkling = "Aspersão",
  MicroSprinkling = "Micro-Aspersão",
  Dripping = "Gotejamento",
  Pivot = "Pivô",
  Sulcos = "Sulcos",
}

export type IrrigationSystemTypes = `${
  | irrigationsTypesNames.Dripping
  | irrigationsTypesNames.MicroSprinkling
  | irrigationsTypesNames.Pivot
  | irrigationsTypesNames.Sprinkling
  | irrigationsTypesNames.Sulcos}`;

export type IrrigationSystemMeasurementsTypes =
  | SulcosProps
  | PivotProps
  | MicroSprinklingOrDrippingProps
  | SprinklingProps;

export interface IrrigationSystem {
  type: IrrigationSystemTypes;
  efficiency: number; // Percentage
  applicationRate: number;
  measurements: IrrigationSystemMeasurementsEntity;
}

export class IrrigationSystemEntity implements IrrigationSystem {
  public type: IrrigationSystemTypes;
  public efficiency: number; // Percentage
  public measurements: IrrigationSystemMeasurementsEntity;
  public applicationRate: number = 0;

  constructor({
    type,
    efficiency,
    measurements,
  }: {
    type: IrrigationSystemTypes;
    efficiency: number;
    measurements: IrrigationSystemMeasurementsEntity;
  }) {
    this.type = type;
    this.efficiency = efficiency;
    this.measurements = measurements;
    this.applicationRate = this.measurements.applicationRate();
  }

  /*calcAplicationRate() {
    // "Micro-Aspersão" ou "Gotejamento"
    return this.measurements.applicationRate();
  }*/
}
