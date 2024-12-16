import { Either, left, right } from "../../../../shared/Either";
import { decimalInMinutesToHoursAndMinutes } from "../../../../shared/utils/date";
import { IrrigantErrors } from "../errors/irrigant.error";

export type IrrigationSystemProps = MicroSprinklingProps & DrippingProps & SprinklingProps & PivotProps & SulcosProps

export type IrrigationSystem = MicroSprinkling | Dripping | Sprinkling | Pivot | Sulcos

export enum irrigationsTypesNames {
  Sprinkling = "Aspersão",
  MicroSprinkling = "Microaspersão",
  Dripping = "Gotejamento",
  Pivot = "Pivô Central",
  Sulcos = "Sulcos",
}

export type IrrigationSystemTypes = `${| irrigationsTypesNames.Dripping
  | irrigationsTypesNames.MicroSprinkling
  | irrigationsTypesNames.Pivot
  | irrigationsTypesNames.Sprinkling
  | irrigationsTypesNames.Sulcos}`;

type SistemEfficiency = {
  Efficiency: number;
};

type ApplicationRate = {
  ApplicationRate: number;
};


export type SprinklingProps = {
  Precipitation: number;
} & SistemEfficiency & ApplicationRate;

export type SulcosProps = {
  Length: number;
  Spacing: number;
  Flow: number;
} & SistemEfficiency & ApplicationRate;

export type PivotProps = {
  Time: number; // Tempo para uma volta
  Area: number; // Lâmina irrigada
  Velocity: number;
} & SistemEfficiency;

/**
  *   Quantity = Quantidade de micro aspersores
  *   Area =  Área irrigada há 1 hectare
  *   Flow  =  Vazão dos micro aspersores  (litros por hora)
*/
export type MicroSprinklingProps = {
  Flow: number;
  Area: number;
  Quantity: number;
} & SistemEfficiency & ApplicationRate;

/**
  *   Quantity = Quantidade de emissores
  *   Area =  Área irrigada há 1 hectare
  *   Flow  =  Vazão de emissores  (litros por hora)
*/
export type DrippingProps = {
  Flow: number;
  Area: number;
  Quantity: number;
} & SistemEfficiency & ApplicationRate;



export type CreateSulcosProps = {
  Length: number;
  Spacing: number;
  Flow: number;
} & Partial<SistemEfficiency>

export class Sulcos implements SulcosProps {
  static DEFAULT_EFFICIENCY = 60;

  private _props: SulcosProps;

  constructor(props: CreateSulcosProps) {
    this._props = {
      ...props,
      Efficiency: (props.Efficiency || Sulcos.DEFAULT_EFFICIENCY),
      ApplicationRate: props.Flow / (props.Length * props.Spacing)
    }
  }

  public get Efficiency() {
    return this._props.Efficiency / 100
  }

  public get ApplicationRate() {
    return this._props.ApplicationRate;
  }

  public get Length() {
    return this._props.Length
  }

  public get Spacing() {
    return this._props.Spacing
  }

  public get Flow() {
    return this._props.Flow
  }

  static create(props: CreateSulcosProps): Either<Error, Sulcos> {
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

export type CreatePivotProps = {
  Time: number; // Tempo para uma volta
  Area: number; // Lâmina irrigada em uma volta a 100% de velocidade
} & Partial<SistemEfficiency>;

export class Pivot implements PivotProps {
  static DEFAULT_EFFICIENCY = 82.5;

  private _props: PivotProps;

  constructor(props: CreatePivotProps) {
    this._props = {
      ...props,
      Efficiency: (props.Efficiency || Pivot.DEFAULT_EFFICIENCY),
      Velocity: 0 // set initial value
    }
  }
  public get Time(): number {
    return this._props.Time
  }

  public get Area(): number {
    return this._props.Area
  }

  public get Efficiency(): number {
    return this._props.Efficiency / 100
  }

  public get Velocity(): number {
    return this._props.Velocity;
  }

  // Tempo estimado de funcionamento em horas e minutos
  public calOperatingTime(): string {
    const timesForLapInMinutes = this._props.Time

    const operationTime = Math.ceil(timesForLapInMinutes / this.Velocity)

    return decimalInMinutesToHoursAndMinutes(operationTime)
  }

  // Ajuste na velocidade do pivô (em porcentagem)
  public setVelocity(reposition: number) {
    if (reposition <= 0) {
      this._props.Velocity = 0
      return
    }

    const irrigatedBladeInOneTurnInPercentage = this._props.Area

    //  Lâmina irrigada em uma volta a 100% da velocidade / Lâmina de reposição
    const velocity = irrigatedBladeInOneTurnInPercentage / reposition

    // a velocidade é uma porcentagem, e não pode ser maior que 100%, para manter o tempo mínimo
    this._props.Velocity = velocity > 1 ? 1 : velocity
  }


  static create(props: CreatePivotProps): Either<Error, Pivot> {
    for (const prop of [
      {
        name: "Lâmina irrigada",
        value: props.Area,
        msg: "Lâmina irrigada em uma volta do sistema pivô tem que ser informada e seu valor deve ser inteiro",
      },
      {
        name: "Tempo",
        value: props.Time,
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


export type CreateMicroSprinklingProps = {
  Flow: number;
  Area: number;
  Quantity: number
} & Partial<SistemEfficiency>
export class MicroSprinkling implements MicroSprinklingProps {
  static DEFAULT_EFFICIENCY = 77.5;

  private _props: MicroSprinklingProps;

  constructor(props: CreateMicroSprinklingProps) {
    this._props = {
      ...props,
      Efficiency: props.Efficiency || MicroSprinkling.DEFAULT_EFFICIENCY,
      ApplicationRate: (props.Quantity * props.Flow) / (props.Area * 10000)
    }
  }

  public get Flow(): number {
    return this._props.Flow
  }

  public get Area(): number {
    return this._props.Area
  }

  public get Quantity(): number {
    return this._props.Quantity
  }

  public get Efficiency(): number {
    return this._props.Efficiency / 100
  }

  public get ApplicationRate(): number {
    return this._props.ApplicationRate
  }

  static create(props: CreateMicroSprinklingProps): Either<Error, MicroSprinkling> {
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

export type CreateDrippingProps = {
  Flow: number;
  Area: number;
  Quantity: number
} & Partial<SistemEfficiency>

export class Dripping implements DrippingProps {
  static DEFAULT_EFFICIENCY = 82.5;

  private _props: DrippingProps;

  constructor(props: CreateDrippingProps) {
    this._props = {
      ...props,
      Efficiency: props.Efficiency || Dripping.DEFAULT_EFFICIENCY,
      ApplicationRate: (props.Quantity * props.Flow) / (props.Area * 10000)
    }
  }

  public get Flow(): number {
    return this._props.Flow
  }

  public get Area(): number {
    return this._props.Area
  }

  public get Quantity(): number {
    return this._props.Quantity
  }

  public get Efficiency(): number {
    return this._props.Efficiency / 100
  }

  public get ApplicationRate(): number {
    return this._props.ApplicationRate
  }

  static create(props: CreateDrippingProps): Either<Error, Dripping> {
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

export type CreateSprinklingProps = {
  Precipitation: number;
} & Partial<SistemEfficiency>

export class Sprinkling implements SprinklingProps {
  static DEFAULT_EFFICIENCY = 82.5;

  private _props: SprinklingProps;

  constructor(props: CreateSprinklingProps) {
    this._props = {
      ...props,
      Efficiency: props.Efficiency || Sprinkling.DEFAULT_EFFICIENCY,
      ApplicationRate: props.Precipitation
    }
  }

  public get Precipitation(): number {
    return this._props.Precipitation
  }
  public get Efficiency(): number {
    return this._props.Efficiency / 100
  }

  public get ApplicationRate(): number {
    return this._props.ApplicationRate
  }

  static create(props: CreateSprinklingProps): Either<Error, Sprinkling> {
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


export function makeIrrigationSystem(data: {
  Type: IrrigationSystemTypes;
  Measurements: any;
}): Either<Error, MicroSprinkling | Dripping | Sprinkling | Pivot | Sulcos> {
  switch (data.Type) {
    case irrigationsTypesNames.MicroSprinkling:
      return MicroSprinkling.create(data.Measurements as CreateMicroSprinklingProps);
    case irrigationsTypesNames.Dripping:
      return Dripping.create(data.Measurements as CreateDrippingProps);
    case irrigationsTypesNames.Sprinkling:
      return Sprinkling.create(data.Measurements as CreateSprinklingProps);
    case irrigationsTypesNames.Pivot:
      return Pivot.create(data.Measurements as CreatePivotProps);
    case irrigationsTypesNames.Sulcos:
      return Sulcos.create(data.Measurements as CreateSulcosProps);
    default:
      return left(new IrrigantErrors.IrrigationSystemNotRecognized());
  }
}
