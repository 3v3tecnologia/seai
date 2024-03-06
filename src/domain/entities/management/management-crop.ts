import { Either, right } from "../../../shared/Either";
import { ManagementCropCycle } from "./management-crop-cycles";

export type ManagementCropParams = {
  name: string;
  locationName: string | null;
  cycles: Array<ManagementCropCycle>;
};

export class ManagementCrop {
  private _id: number | null;
  private readonly _name: string;
  private readonly _locationName: string | null;
  private readonly _cycles: Array<ManagementCropCycle>;

  private constructor(props: ManagementCropParams, id?: number) {
    this._id = id || null;
    this._name = props.name;
    this._cycles = props.cycles;
    this._locationName = props.locationName;

    Object.freeze(this);
  }

  set id(id: number) {
    this._id = id;
  }

  get id(): number | null {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get location() {
    return this._locationName;
  }

  get cycles() {
    return this._cycles;
  }

  static create(
    props: ManagementCropParams,
    id?: number
  ): Either<Error, ManagementCrop> {
    // TO-DO : check cycles validations
    const culture = new ManagementCrop(props, id);

    return right(culture);
  }
}
