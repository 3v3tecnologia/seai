import { Either, left, right } from "../../../../shared/Either";

export interface IIrrigationSystemMeasurementsEntity {
  efficiency(): number;
  applicationRate(): number;
  getAllMeasurement(): any
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
  TimeForLap: number; // Tempo para uma volta
  Irrigated: number; // Lâmina irrigada
  Velocity: number;
} & Partial<SistemEfficiency>;

/**
  *   Quantity = Quantidade de micro aspersores
  *   Area =  Área irrigada há 1 hectare
  *   Flow  =  Vazão dos micro aspersores  (litros por hora)
*/
export type MicroSprinklingProps = {
  Flow: number;
  Area: number;
  Quantity: number;
} & Partial<SistemEfficiency>;

/**
  *   Quantity = Quantidade de emissores
  *   Area =  Área irrigada há 1 hectare
  *   Flow  =  Vazão de emissores  (litros por hora)
*/
export type DrippingProps = {
  Flow: number;
  Area: number;
  Quantity: number;
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

  public getAllMeasurement(): any {
    const props = this._props
    return {
      ...props,
      Efficiency: this.efficiency(),
      ApplicationRate: this.applicationRate()
    }
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
    return 0
  }

  public get Velocity(): number {
    return this._props.Velocity || 0;
  }

  // Tempo estimado de funcionamento em horas e minutos
  public calcOperatingTime(): number {
    const timesForLapInMinutes = this._props.TimeForLap * 60
    return Math.ceil(timesForLapInMinutes / this.Velocity)
  }

  // Ajuste na velocidade do pivô (em porcentagem)
  public setVelocity(reposition: number) {
    //  Lâmina irrigada / Lâmina de reposição
    this._props.Velocity = this._props.Irrigated / reposition
  }


  static create(props: PivotProps): Either<Error, Pivot> {
    for (const prop of [
      {
        name: "Lâmina irrigada",
        value: props.Irrigated,
        msg: "Lâmina irrigada em uma volta do sistema pivô tem que ser informada e seu valor deve ser inteiro",
      },
      {
        name: "Tempo",
        value: props.TimeForLap,
        msg: "Tempo para uma volta do sistema pivô tem que ser informado e seu valor deve ser inteiro",
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
    return (this._props.Quantity * this._props.Flow) / (this._props.Area * 10000)
  }

  static create(props: MicroSprinklingProps): Either<Error, MicroSprinkling> {
    for (const prop of [
      {
        name: "Área irrigada",
        value: props.Area,
        msg: "Área irrigada tem que ser informada e seu valor deve ser inteiro",
      },
      {
        name: "Vazão",
        value: props.Flow,
        msg: "Vazão dos micro aspersores tem que ser informada e seu valor deve ser inteiro",
      },
      {
        name: "Quantidade de plantas",
        value: props.Quantity,
        msg: "Quantidade de micro aspersores tem que ser informada e seu valor deve ser inteiro",
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
    return (this._props.Quantity * this._props.Flow) / (this._props.Area * 10000)
  }

  static create(props: DrippingProps): Either<Error, Dripping> {
    for (const prop of [
      {
        name: "Área irrigada",
        value: props.Area,
        msg: "Área irrigada tem que ser informada e seu valor deve ser inteiro",
      },
      {
        name: "Vazão",
        value: props.Flow,
        msg: "Vazão tem que ser informada e seu valor deve ser inteiro",
      },
      {
        name: "Quantidade de plantas",
        value: props.Quantity,
        msg: "Quantidade de emissores tem que ser informada e seu valor deve ser inteiro",
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
