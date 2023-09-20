export interface StationRead {
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
    RelativeHumidity: {
      Unit: string;
      Value: number;
    };
    AtmosphericTemperature: {
      Unit: string;
      Value: number;
    };
    WindVelocity: {
      Unit: string;
      Value: number;
    };
    ETO: {
      Unit: string;
      Value: number;
    };
  };
}

export interface PluviometerRead {
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
export interface Equipment {
  Id: number;
  Code: number;
  Name: string;
  Type: string;
  Altitude: number;
  Organ: string;
  LocationPosition: string;
  LocationName: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface EquipmentsRepositoryProtocol {
  getEquipments(): Promise<Array<Equipment> | null>;
  getStationsReads(): Promise<Array<StationRead> | null>;
  getPluviometersReads(): Promise<Array<PluviometerRead> | null>;
}
