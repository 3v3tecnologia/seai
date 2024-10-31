import { formatDateStringToTime } from "../../../../shared/utils/date";
import { UserIrrigationPreferences } from "../../services/dto/irrigation-recommendation";
import { irrigationsTypesNames, IrrigationSystemTypes } from "../model/irrigation-system";

function mapToIrrigationSystem(data: any) {
  switch (data.SystemType) {
    case irrigationsTypesNames.MicroSprinkling:
      return {
        Area: data.Area as number,
        Flow: data.Flow as number,
        Quantity: data.Quantity as number,
      };
    case irrigationsTypesNames.Dripping:
      return {
        Area: data.Area as number,
        Flow: data.Flow as number,
        Quantity: data.Quantity as number,
      };
    case irrigationsTypesNames.Sprinkling:
      return {
        Precipitation: data.System_Precipitation as number,
      };
    case irrigationsTypesNames.Pivot:
      return {
        Time: data.Time as number,
        Area: data.Area as number
      };
    case irrigationsTypesNames.Sulcos:
      return {
        Length: data.Length as number,
        Spacing: data.Spacing as number,
        Flow: data.Flow as number,
      };
    default:
      throw new Error("Tipo de sistema não reconhecido.");
  }
}

export function mapUserIrrigationPreferencesToDomain(data: any): UserIrrigationPreferences {
  const {
    id,
    name,
    planting_date,
    flow,
    system_type,
    area,
    effective_area,
    quantity,
    sprinkler_precipitation,
    length,
    spacing,
    created_at,
    updated_at,
    crop_id,
    crop_name,
    crop_deleted_at,
    station_id,
    ETo,
    pluviometer_id,
    pluviometry,
    time
  } = data;


  const sanitalizedPreferences = {
    Id: Number(id),
    Name: name,
    CropId: null,
    Crop: null,
    SystemType: system_type as IrrigationSystemTypes,
    PlantingDate: planting_date,
    StationId: Number(station_id),
    ETo: ETo ? Number(ETo) : null,
    PluviometerId: Number(pluviometer_id),
    Pluviometry: pluviometry ? Number(pluviometry) : null,
    Flow: flow ? Number(flow) : null,
    Area: area ? Number(area) : null,
    Time: time ? Number(time) : null,
    EffectiveArea: effective_area ? Number(effective_area) : null,
    Quantity: quantity ? Number(quantity) : null,
    System_Precipitation: sprinkler_precipitation
      ? Number(sprinkler_precipitation)
      : null,
    Length: length ? Number(length) : null,
    Spacing: spacing ? Number(spacing) : null,
    CreatedAt: created_at,
    UpdatedAt: updated_at,
  }

  if (crop_deleted_at === null) {
    Object.assign(sanitalizedPreferences, {
      CropId: Number(crop_id),
      Crop: crop_name,
    })
  }


  const props = {
    Name: sanitalizedPreferences.Name,
    CropId: sanitalizedPreferences.CropId,
    Crop: sanitalizedPreferences.Crop,
    PlantingDate: formatDateStringToTime(sanitalizedPreferences.PlantingDate),
    Pluviometer: {
      Id: sanitalizedPreferences.PluviometerId,
    },
    Station: {
      Id: sanitalizedPreferences.StationId,
    },
    System: {
      Type: sanitalizedPreferences.SystemType as IrrigationSystemTypes,
      Measurements: mapToIrrigationSystem(sanitalizedPreferences),
    },
    CreatedAt: sanitalizedPreferences.CreatedAt,
    UpdatedAt: sanitalizedPreferences.UpdatedAt
  };

  if (data.id) {
    Object.assign(props, {
      Id: sanitalizedPreferences.Id,
    });
  }

  return props as UserIrrigationPreferences
}
