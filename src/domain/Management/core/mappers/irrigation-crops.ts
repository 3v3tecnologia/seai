import { IUserRecordedRecommendationData } from "../../repositories/protocols/irrigation.repository";
import { IrrigationSystemTypes } from "../model/irrigation-system";

export function mapIrrigationCropsToDomain(
  row: any
): IUserRecordedRecommendationData {
  const {
    id,
    planting_date,
    flow,
    system_type,
    area,
    effective_area,
    plants_qtd,
    sprinkler_precipitation,
    length,
    spacing,
    created_at,
    updated_at,
    crop_id,
    crop_name,
    station_id,
    ETo,
    pluviometer_id,
    pluviometry,
  } = row;

  return {
    Id: Number(id),
    Name: crop_name,
    CropId: Number(crop_id),
    Crop: crop_name,
    SystemType: system_type as IrrigationSystemTypes,
    PlantingDate: planting_date,
    StationId: Number(station_id),
    ETo: ETo ? Number(ETo) : null,
    PluviometerId: Number(pluviometer_id),
    Pluviometry: pluviometry ? Number(pluviometry) : null,
    Flow: flow ? Number(flow) : null,
    Area: area ? Number(area) : null,
    EffectiveArea: effective_area ? Number(effective_area) : null,
    PlantsQtd: plants_qtd ? Number(plants_qtd) : null,
    System_Precipitation: sprinkler_precipitation
      ? Number(sprinkler_precipitation)
      : null,
    Length: length ? Number(length) : null,
    Spacing: spacing ? Number(spacing) : null,
    CreatedAt: created_at,
    UpdatedAt: updated_at,
  };
}
