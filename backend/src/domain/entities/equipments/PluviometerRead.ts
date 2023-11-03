export interface PluviometerReadEntity {
  Date: string;
  IdRead: number;
  IdEquipment: number;
  Code: number;
  Name: string;
  Measures: {
    Precipitation: {
      Unit: string;
      Value: number;
    };
  };
}
