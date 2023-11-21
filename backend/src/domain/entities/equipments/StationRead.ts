export interface StationReadEntity {
  IdRead: number;
  IdEquipment: number;
  Time: string;
  Hour: string;
  TotalRadiation: {
    Unit: string;
    Value: number | null;
  };
  AverageRelativeHumidity: {
    Unit: string;
    Value: number | null;
  };
  MinRelativeHumidity: {
    Unit: string;
    Value: number | null;
  };
  MaxRelativeHumidity: {
    Unit: string;
    Value: number | null;
  };
  AverageAtmosphericTemperature: {
    Unit: string;
    Value: number | null;
  };
  MaxAtmosphericTemperature: {
    Unit: string;
    Value: number | null;
  };
  MinAtmosphericTemperature: {
    Unit: string;
    Value: number | null;
  };
  AtmosphericPressure: {
    Unit: string;
    Value: number | null;
  };
  ETO: {
    Unit: string;
    Value: number | null;
  };
}
