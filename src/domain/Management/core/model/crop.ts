import { Either, right } from "../../../../shared/Either";
import { dateDiffInDays, parseBrazilianDateTime } from "../../../../shared/utils/date";
import { ManagementCropCycle } from "./crop-cycles";

export type ManagementCropParams = {
  Id?: number;
  Name: string;
  LocationName: string | null;
  Cycles?: Array<ManagementCropCycle>;
};

export class ManagementCrop {
  private _id: number | null;
  private readonly _name: string;
  private readonly _locationName: string | null;
  private readonly _cycles: Array<ManagementCropCycle>;

  private constructor(props: ManagementCropParams) {
    this._id = props.Id || null;
    this._name = props.Name;
    this._cycles = props.Cycles || [];
    this._locationName = props.LocationName;

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

  get Location() {
    return this._locationName;
  }

  get Cycles() {
    return this._cycles;
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