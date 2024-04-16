import {
  IrrigationSystemMeasurementsEntity,
  DrippingProps,
  MicroSprinklingProps,
  PivotProps,
  SprinklingProps,
  SulcosProps,
  MicroSprinkling,
  Dripping,
  Sprinkling,
  Pivot,
  Sulcos,
  IIrrigationSystemMeasurementsEntity,
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
  | DrippingProps
  | MicroSprinklingProps
  | SprinklingProps;

export interface IrrigationSystem {
  type: IrrigationSystemTypes;
  efficiency: number; // Percentage
  applicationRate: number;
  measurements: MicroSprinkling | Dripping | Sprinkling | Pivot | Sulcos;
}

export class IrrigationSystemEntity {
  public type: IrrigationSystemTypes;
  public efficiency: number; // Percentage
  public measurements: IIrrigationSystemMeasurementsEntity;
  public applicationRate: number = 0;

  constructor({
    type,
    measurements,
  }: {
    type: IrrigationSystemTypes;
    measurements: IIrrigationSystemMeasurementsEntity;
  }) {
    this.type = type;
    this.measurements = measurements;
    this.efficiency = this.measurements.efficiency();
    this.applicationRate = this.measurements.applicationRate();
  }

  /*calcAplicationRate() {
    // "Micro-Aspersão" ou "Gotejamento"
    return this.measurements.applicationRate();
  }*/
}
