export interface StationReadEntity {
  Date: string;
  IdRead: number;
  IdEquipment: number;
  Code: number;
  Name: string;
  Measures: {
    TotalRadiation: {
      Unit: string;
      Value: number;
    };
    AverageRelativeHumidity: {
      Unit: string;
      Value: number;
    };
    MinRelativeHumidity: {
      Unit: string;
      Value: number;
    };
    MaxRelativeHumidity: {
      Unit: string;
      Value: number;
    };
    AverageAtmosphericTemperature: {
      Unit: string;
      Value: number;
    };
    MaxAtmosphericTemperature: {
      Unit: string;
      Value: number;
    };
    MinAtmosphericTemperature: {
      Unit: string;
      Value: number;
    };
    AtmosphericPressure: {
      Unit: string;
      Value: number;
    };
    ETO: {
      Unit: string;
      Value: number;
    };
  };
}
