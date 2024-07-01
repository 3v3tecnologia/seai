export type IrrigationCrop = {
  Id: number;
  Name: string;
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

export type IrrigationRecommendationProps = {
  Id: number;
  Crop: IrrigationCrop;
  System: IrrigationSystem;
  Equipments: Equipments;
  Created_at: string;
  Updated_at?: string | null;
};

export class IrrigationRecommendation implements IrrigationRecommendationProps {
  readonly Id: number;
  readonly Crop: IrrigationCrop;
  readonly System: IrrigationSystem;
  readonly Equipments: Equipments;
  readonly Created_at: string;
  readonly Updated_at?: string | null;
  // readonly Equipments: Equipments;

  constructor(props: IrrigationRecommendationProps) {
    this.Id = props.Id;
    this.Crop = props.Crop;
    this.System = props.System;
    this.Equipments = props.Equipments;
    this.Created_at = props.Created_at;
    this.Updated_at = props.Updated_at;
  }
}
