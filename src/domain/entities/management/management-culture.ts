import { CultureCyclesDTO } from "../../use-cases/management/dto/management-culture-cycles.dto";
import { Basin } from "./basin";

export type ManagementCultureProps = {
  name: string;
  basin: Basin;
  locationName: string | null;
  cycles: Array<CultureCyclesDTO>;
};

export class ManagementCulture {
  private readonly _id: number | null;
  private readonly _name: string;
  private readonly _basin: Basin;
  private readonly _locationName: string | null;
  private readonly _cycles: Array<CultureCyclesDTO>;

  constructor(props: ManagementCultureProps, id?: number) {
    this._id = id || null;
    this._name = props.name;
    this._basin = props.basin;
    this._cycles = props.cycles;
    this._locationName = props.locationName;

    Object.freeze(this);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get basin() {
    return this._basin;
  }

  get location() {
    return this._locationName;
  }

  get cycles() {
    return this._cycles;
  }
}
