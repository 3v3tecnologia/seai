export interface PluviometerReadEntity {
  IdRead: number;
  IdEquipment: number;
  Time: string;
  Hour: string;
  Precipitation: {
    Unit: string;
    Value: number | null;
  };
}
