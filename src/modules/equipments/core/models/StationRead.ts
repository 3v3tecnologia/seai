export interface StationReadEntity {
  IdRead: number;
  IdEquipment: number;
  Time: string;
  Hour: string;
  Altitude: {
    Unit: string;
    Value: number | null;
  };
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
  WindVelocity: {
    Unit: string;
    Value: number | null;
  };
  Et0: {
    Unit: string;
    Value: number | null;
  };
}
