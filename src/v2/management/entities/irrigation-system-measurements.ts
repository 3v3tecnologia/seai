export interface IrrigationSystemMeasurementsEntity {
  applicationRate(): number;
}

export type SulcosProps = {
  Length: number;
  Spacing: number;
  Flow: number;
};

export class Sulcos implements IrrigationSystemMeasurementsEntity {
  private _props: SulcosProps;
  constructor(props: SulcosProps) {
    this._props = props;
  }
  public applicationRate(): number {
    return this._props.Flow / (this._props.Length * this._props.Spacing);
  }
}

export type PivotProps = {
  Precipitation: number;
};

export class Pivot {
  private _precipitation: number;
  constructor(props: PivotProps) {
    this._precipitation = props.Precipitation;
  }
  public applicationRate(): number {
    return this._precipitation;
  }
}

export type MicroSprinklingOrDrippingProps = {
  Flow: number;
  Area: number;
  EfectiveArea: number;
  PlantsQtd: number;
};

export class MicroSprinklingOrDripping
  implements IrrigationSystemMeasurementsEntity
{
  private _props: MicroSprinklingOrDrippingProps;
  constructor(props: MicroSprinklingOrDrippingProps) {
    this._props = props;
  }

  public applicationRate(): number {
    return (
      this._props.Flow /
      (this._props.Area * this._props.EfectiveArea * this._props.PlantsQtd)
    );
  }
}

export type SprinklingProps = {
  Precipitation: number;
};

export class Sprinkling implements IrrigationSystemMeasurementsEntity {
  private _precipitation: number;
  constructor(props: SprinklingProps) {
    this._precipitation = props.Precipitation;
  }
  public applicationRate(): number {
    // [Dúvida] Vai precisar converter dados da asperção para tempo?
    return this._precipitation;
  }
}

export function isMicroSprinklingOrDripping(
  measurements: IrrigationSystemMeasurementsEntity
): measurements is MicroSprinklingOrDripping {
  return measurements instanceof MicroSprinklingOrDripping;
}

export function isSprinkling(
  measurements: IrrigationSystemMeasurementsEntity
): measurements is Sprinkling {
  return measurements instanceof Sprinkling;
}

export function isPivot(
  measurements: IrrigationSystemMeasurementsEntity
): measurements is Pivot {
  return measurements instanceof Pivot;
}

export function isSulcos(
  measurements: IrrigationSystemMeasurementsEntity
): measurements is Sulcos {
  return measurements instanceof Sulcos;
}
