export interface PluviometerReadEntity {
  IdRead?: number | null;
  IdEquipment?: number;
  Time: string;
  Hour: string;
  Precipitation: {
    Unit: string;
    Value: number | null;
  };
}
