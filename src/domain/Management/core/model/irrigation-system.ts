import { Either, left, right } from "../../../../shared/Either";
import { IrrigantErrors } from "../errors/irrigant.error";
import {
  Dripping,
  DrippingProps,
  IIrrigationSystemMeasurementsEntity,
  MicroSprinkling,
  MicroSprinklingProps,
  Pivot,
  PivotProps,
  Sprinkling,
  SprinklingProps,
  Sulcos,
  SulcosProps,
} from "./irrigation-system-measurements";

export enum irrigationsTypesNames {
  Sprinkling = "Aspersão",
  MicroSprinkling = "Microaspersão",
  Dripping = "Gotejamento",
  Pivot = "Pivô Central",
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

export function makeSystemIrrigationMeasurements(data: {
  Type: IrrigationSystemTypes;
  Measurements: IrrigationSystemMeasurementsTypes;
}): Either<Error, IIrrigationSystemMeasurementsEntity> {
  switch (data.Type) {
    case irrigationsTypesNames.MicroSprinkling:
      return MicroSprinkling.create(data.Measurements as MicroSprinklingProps);
    case irrigationsTypesNames.Dripping:
      return Dripping.create(data.Measurements as DrippingProps);
    case irrigationsTypesNames.Sprinkling:
      return Sprinkling.create(data.Measurements as SprinklingProps);
    case irrigationsTypesNames.Pivot:
      return Pivot.create(data.Measurements as PivotProps);
    case irrigationsTypesNames.Sulcos:
      return Sulcos.create(data.Measurements as SulcosProps);
    default:
      return left(new IrrigantErrors.IrrigationSystemNotRecognized());
  }
}

export function makeIrrigationSystem(data: {
  Type: IrrigationSystemTypes;
  Measurements: IrrigationSystemMeasurementsTypes;
}): Either<Error, IrrigationSystemEntity> {
  const systemMeasurementsOrError = makeSystemIrrigationMeasurements({
    Type: data.Type,
    Measurements: data.Measurements,
  });

  if (systemMeasurementsOrError.isLeft()) {
    return left(systemMeasurementsOrError.value);
  }

  return right(
    new IrrigationSystemEntity({
      type: data.Type,
      measurements:
        systemMeasurementsOrError.value as IIrrigationSystemMeasurementsEntity,
    })
  );
}
