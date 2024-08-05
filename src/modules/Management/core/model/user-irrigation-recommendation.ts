import { IrrigationRecommendation } from "./irrigation-recommendation";

export type UserIrrigationRecommendationProps = {
  Name: string;
  Email: string;
  Irrigation?: Array<IrrigationRecommendation>;
};

export class UserIrrigationRecommendation {
  readonly Name: string;
  readonly Email: string;
  private _Notification?: string;
  private _Irrigation: Array<IrrigationRecommendation> = [];

  constructor(props: UserIrrigationRecommendationProps) {
    this.Name = props.Name;
    this.Email = props.Email;

    if (props?.Irrigation) {
      this._Irrigation = props.Irrigation;
    }
  }

  setNotification(message: string) {
    this._Notification = message;
  }

  addIrrigation(data: IrrigationRecommendation) {
    this._Irrigation.push(data);
  }

  get Irrigation() {
    return this._Irrigation.length ? this._Irrigation : null;
  }

  get Notification() {
    return this._Notification ? this._Notification : undefined;
  }

}
