import { Either, left, right } from "../../../../shared/Either";
import {
  dateDiffInDays,
  parseBrazilianDateTime,
} from "../../../../shared/utils/date";
import { ManagementCropErrors } from "../errors/crop-errors";
import { ManagementCropCycle } from "./crop-cycles";

export type ManagementCropParams = {
  Id?: number;
  Name: string;
  IsPermanent: boolean;
  CycleRestartPoint: string;
  Cycles?: Array<ManagementCropCycle>;
};

export class ManagementCrop {
  private _id: number | null;
  private readonly _name: string;
  private readonly _isPermanent: boolean;
  private readonly _cycleRestartPoint: string;
  private readonly _cycles: Array<ManagementCropCycle>;

  private constructor(props: ManagementCropParams) {
    this._id = props.Id || null;
    this._name = props.Name;
    this._cycles = props.Cycles || [];
    this._cycleRestartPoint = props.CycleRestartPoint;
    this._isPermanent = props.IsPermanent;

    Object.freeze(this);
  }

  set Id(id: number) {
    this._id = id;
  }

  get Id(): number | null {
    return this._id;
  }

  get Name() {
    return this._name;
  }

  get CycleRestartPoint() {
    return this._cycleRestartPoint;
  }

  get IsPermanent() {
    return this._isPermanent;
  }

  get Cycles() {
    return this._cycles;
  }

  findKc(
    cropDate: number,
  ): Either<Error, ManagementCropCycle> {
    const startCropCycle = this.Cycles[0];

    if (cropDate < startCropCycle.Start) {
      return left(
        new ManagementCropErrors.PlantingDateIsBeforeThanCropCycleStartDate(
          startCropCycle.Start - cropDate
        )
      );
    }

    const endCropCycle = this.Cycles[this.Cycles.length - 1];

    if (cropDate > endCropCycle.End) {
      // Se for cultura perene então deverá buscar os dados de KC
      // a partir do ponto de início do ciclo de desenvolvimento especificado.
      if (this.CycleRestartPoint) {
        const data = this.Cycles.find(
          (cycle) => cycle.Title === this.CycleRestartPoint
        );

        if (data) return right(data);
      }

      return left(
        new ManagementCropErrors.PlantingDateIsAfterThanCropCycleEndDate()
      );
    }

    const data = this.Cycles.find(
      (cycle) => cropDate >= cycle.Start && cropDate <= cycle.End
    );

    if (data) {
      return right(data);
    }

    return left(new ManagementCropErrors.KcNotFound());
  }

  static create(props: ManagementCropParams): Either<Error, ManagementCrop> {
    // TO-DO : check cycles validations
    const culture = new ManagementCrop(props);

    return right(culture);
  }
}

export function getCropDate(plantingDate: string) {
  const currentDate = new Date();
  const diff = dateDiffInDays(
    currentDate,
    new Date(parseBrazilianDateTime(plantingDate))
  );
  return diff < 0 ? 0 : diff;
}
