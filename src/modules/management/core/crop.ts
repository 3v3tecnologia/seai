import { Either, right } from "../../../shared/Either";
import { ManagementCropCycle } from "../../irrigant/blade_suggestion/core/model/crop-cycles";

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
