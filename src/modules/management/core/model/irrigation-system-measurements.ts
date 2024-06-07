import { Either, left, right } from "../../../../shared/Either";

export interface IIrrigationSystemMeasurementsEntity {
  efficiency(): number;
  applicationRate(): number;
}

type SistemEfficiency = {
  Efficiency: number;
};
export type SprinklingProps = {
  Precipitation: number;
} & Partial<SistemEfficiency>;

export type SulcosProps = {
  Length: number;
  Spacing: number;
  Flow: number;
} & Partial<SistemEfficiency>;

export type PivotProps = {
  Precipitation: number;
} & Partial<SistemEfficiency>;

export type MicroSprinklingProps = {
  Flow: number;
  Area: number;
  EfectiveArea: number;
  PlantsQtd: number;
} & Partial<SistemEfficiency>;

export type DrippingProps = {
  Flow: number;
  Area: number;
  EfectiveArea: number;
  PlantsQtd: number;
} & Partial<SistemEfficiency>;

export abstract class IrrigationSystemMeasurementsEntity<
  T extends { Efficiency: number }
> implements IIrrigationSystemMeasurementsEntity {
  protected _efficiency: number;
  protected _props: T;

  constructor(props: T) {
    this._efficiency = props.Efficiency;
    this._props = props;
  }
  public efficiency(): number {
    return this._efficiency / 100;
  }
  public abstract applicationRate(): number;
}

export class Sulcos extends IrrigationSystemMeasurementsEntity<
  Required<SulcosProps>
> {
  static DEFAULT_EFFICIENCY = 60;
  constructor(props: SulcosProps) {
    super({
      ...props,
      Efficiency: props.Efficiency || Sulcos.DEFAULT_EFFICIENCY,
    });
  }
  public applicationRate(): number {
    return this._props.Flow / (this._props.Length * this._props.Spacing);
  }

  static create(props: SulcosProps): Either<Error, Sulcos> {
    for (const prop of [
      {
        name: "Vazão",
        value: props.Flow,
        msg: "Vazão tem que ser informada e seu valor deve ser inteiro",
      },
      {
        name: "Espaçamento",
        value: props.Spacing,
        msg: "Vazão tem que ser informada e seu valor deve ser inteiro",
      },
      {
        name: "Comprimento",
        value: props.Length,
        msg: "Vazão tem que ser informada e seu valor deve ser inteiro",
      },
    ]) {
      if (prop.value === null || prop.value === undefined) {
        return left(new Error(prop.msg));
      }
    }
    return right(new Sulcos(props));
  }
}

export class Pivot extends IrrigationSystemMeasurementsEntity<
  Required<PivotProps>
> {
  static DEFAULT_EFFICIENCY = 82.5;

  constructor(props: PivotProps) {
    super({
      ...props,
      Efficiency: props.Efficiency || Pivot.DEFAULT_EFFICIENCY,
    });
  }

  public applicationRate(): number {
    return this._props.Precipitation;
  }

  static create(props: PivotProps): Either<Error, Pivot> {
    for (const prop of [
      {
        name: "Precipitação",
        value: props.Precipitation,
        msg: "Precipitação por volta do sistema pivô tem que ser informada e seu valor deve ser inteiro",
      },
    ]) {
      if (prop.value === null || prop.value === undefined) {
        return left(new Error(prop.msg));
      }
    }
    return right(new Pivot(props));
  }
}

export class MicroSprinkling extends IrrigationSystemMeasurementsEntity<
  Required<MicroSprinklingProps>
> {
  static DEFAULT_EFFICIENCY = 77.5;
  constructor(props: MicroSprinklingProps) {
    super({
      ...props,
      Efficiency: props.Efficiency || MicroSprinkling.DEFAULT_EFFICIENCY,
    });
  }

  public applicationRate(): number {
    return (
      this._props.Flow /
      (this._props.Area * this._props.EfectiveArea * this._props.PlantsQtd)
    );
  }

  static create(props: MicroSprinklingProps): Either<Error, MicroSprinkling> {
    for (const prop of [
      {
        name: "Área plantada",
        value: props.Area,
        msg: "Área plantada tem que ser informada e seu valor deve ser inteiro",
      },
      {
        name: "Área efetiva",
        value: props.EfectiveArea,
        msg: "Área efetiva tem que ser informada e seu valor deve ser inteiro",
      },
      {
        name: "Vazão",
        value: props.Flow,
        msg: "Vazão tem que ser informada e seu valor deve ser inteiro",
      },
      {
        name: "Quantidade de plantas",
        value: props.PlantsQtd,
        msg: "Quantidade de plantas tem que ser informada e seu valor deve ser inteiro",
      },
    ]) {
      if (prop.value === null || prop.value === undefined) {
        return left(new Error(prop.msg));
      }
    }
    return right(new MicroSprinkling(props));
  }
}

export class Dripping extends IrrigationSystemMeasurementsEntity<
  Required<DrippingProps>
> {
  static DEFAULT_EFFICIENCY = 82.5;

  constructor(props: DrippingProps) {
    super({
      ...props,
      Efficiency: props.Efficiency || Dripping.DEFAULT_EFFICIENCY,
    });
  }

  public applicationRate(): number {
    return (
      this._props.Flow /
      (this._props.Area * this._props.EfectiveArea * this._props.PlantsQtd)
    );
  }

  static create(props: DrippingProps): Either<Error, Dripping> {
    for (const prop of [
      {
        name: "Área plantada",
        value: props.Area,
        msg: "Área plantada tem que ser informada e seu valor deve ser inteiro",
      },
      {
        name: "Área efetiva",
        value: props.EfectiveArea,
        msg: "Área efetiva tem que ser informada e seu valor deve ser inteiro",
      },
      {
        name: "Vazão",
        value: props.Flow,
        msg: "Vazão tem que ser informada e seu valor deve ser inteiro",
      },
      {
        name: "Quantidade de plantas",
        value: props.PlantsQtd,
        msg: "Quantidade de plantas tem que ser informada e seu valor deve ser inteiro",
      },
    ]) {
      if (prop.value === null || prop.value === undefined) {
        return left(new Error(prop.msg));
      }
    }
    return right(new Dripping(props));
  }
}

export class Sprinkling extends IrrigationSystemMeasurementsEntity<
  Required<SprinklingProps>
> {
  static DEFAULT_EFFICIENCY = 82.5;

  constructor(props: SprinklingProps) {
    console.log(props.Efficiency || Sprinkling.DEFAULT_EFFICIENCY);
    super({
      ...props,
      Efficiency: props.Efficiency || Sprinkling.DEFAULT_EFFICIENCY,
    });
  }
  public applicationRate(): number {
    // [Dúvida] Vai precisar converter dados da asperção para tempo?
    return this._props.Precipitation;
  }

  static create(props: SprinklingProps): Either<Error, Sprinkling> {
    for (const prop of [
      {
        name: "Precipitação",
        value: props.Precipitation,
        msg: "Precipitação do sistema de asperção tem que ser informada e seu valor deve ser inteiro",
      },
    ]) {
      if (prop.value === null || prop.value === undefined) {
        return left(new Error(prop.msg));
      }
    }
    return right(new Sprinkling(props));
  }
}
