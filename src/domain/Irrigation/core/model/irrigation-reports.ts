
type CropMeasurements = {
  Id: number | null;
  Name: string | null;
  CropDays: number | null;
  Kc: number | null;
  Etc: number | null;
  PlantingDate: string | null;
  RepositionBlade: number | null;
  IrrigationTime: string | null;
  Stage: string | null;
  Warning?: string;
};

type Equipments = {
  Et0: number | null;
  Precipitation: number | null;
};

type IrrigationSystem = {
  IrrigationEfficiency: number | null;
};

export type RecommendationReportsProps = {
  Id: number;
  Name: string;
  Crop: CropMeasurements;
  System: IrrigationSystem;
  Equipments: Equipments;
  Created_at: string;
  Updated_at?: string | null;
};

export class IrrigationRecommendation implements RecommendationReportsProps {
  readonly Id: number;
  readonly Name: string;
  readonly Crop: CropMeasurements;
  readonly System: IrrigationSystem;
  readonly Equipments: Equipments;
  readonly Created_at: string;
  readonly Updated_at?: string | null;
  // readonly Equipments: Equipments;

  constructor(props: RecommendationReportsProps) {
    this.Id = props.Id;
    this.Name = props.Name;
    this.Crop = props.Crop;
    this.System = props.System;
    this.Equipments = props.Equipments;
    this.Created_at = props.Created_at;
    this.Updated_at = props.Updated_at;
  }
}

export type UserIrrigationRecommendationProps = {
  Name: string;
  Email: string;
  Irrigation?: Array<IrrigationRecommendation>;
};

export class IrrigationRecommendationReports {
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
