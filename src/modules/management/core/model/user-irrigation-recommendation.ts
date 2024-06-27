import { IrrigationRecommendation } from "./irrigation-recommendation";

export type UserIrrigationRecommendationProps = {
  Name: string;
  Email: string;
  Irrigation?: Array<IrrigationRecommendation>;
};

export class UserIrrigationRecommendation {
  readonly Name: string;
  readonly Email: string;
  private _Irrigation: Array<IrrigationRecommendation> = [];

  constructor(props: UserIrrigationRecommendationProps) {
    this.Name = props.Name;
    this.Email = props.Email;

    if (props?.Irrigation) {
      this._Irrigation = props.Irrigation;
    }
  }

  addIrrigation(data: IrrigationRecommendation) {
    this._Irrigation.push(data);
  }

  public getIrrigation() {
    return this._Irrigation;
  }
}
