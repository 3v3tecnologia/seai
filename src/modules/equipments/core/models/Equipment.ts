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
  };
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
  Et0: number;
};

export type PluviometerWithLastMeasurement = Omit<
  EquipmentEntity,
  "CreatedAt" | "UpdatedAt"
> & {
  Precipitation: number | null;
};
