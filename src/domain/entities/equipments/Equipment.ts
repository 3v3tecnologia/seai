export interface EquipmentEntity {
  Id?: number;
  Code: number;
  Name: string;
  Type: {
    Id: number;
    Name: string;
  };
  Altitude: number | null;
  Location: {
    // Id: number | null;
    Coordinates: Array<number> | null;
    // Name: string;
  } | null;
  Organ: {
    Id: number;
    Name: string;
  };
  CreatedAt?: string;
  UpdatedAt?: string;
  Enable: boolean;
}

export type StationWithLastMeasurement = Omit<
  EquipmentEntity,
  "CreatedAt" | "UpdatedAt"
> & {
  ETO: number | null;
};

export type PluviometerWithLastMeasurement = Omit<
  EquipmentEntity,
  "CreatedAt" | "UpdatedAt"
> & {
  Precipitation: number | null;
};
