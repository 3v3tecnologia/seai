export interface CropStudies {
  id_basin?: string;
  crop: string;
  harvest_duration_in_months: number | null;
  cultivation_period_in_days: number | null;
  consumption: number | null;
  productivity: number | null;
  year: number | null;
}
