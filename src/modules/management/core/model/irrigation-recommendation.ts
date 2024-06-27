export type IrrigationCrop = {
  Id: number;
  Name: string;
};

type IrrigationSuggestion =
  | {
      Etc: number;
      RepositionBlade: number;
      IrrigationEfficiency: number;
      IrrigationTime: string;
      CropDays: number;
      Et0: number;
      Precipitation: number;
      Kc: number;
    }
  | string;

export type IrrigationRecommendationProps = {
  Id: number;
  Crop: IrrigationCrop;
  Suggestion: IrrigationSuggestion;
  Created_at: string;
  Updated_at?: string | null;
};

export class IrrigationRecommendation implements IrrigationRecommendationProps {
  readonly Id: number;
  readonly Crop: IrrigationCrop;
  readonly Suggestion: IrrigationSuggestion;
  readonly Created_at: string;
  readonly Updated_at?: string | null;
  // readonly Equipments: Equipments;

  constructor(props: IrrigationRecommendationProps) {
    this.Id = props.Id;
    this.Crop = props.Crop;
    this.Suggestion = props.Suggestion;
    this.Created_at = props.Created_at;
    this.Updated_at = props.Updated_at;
  }
}
