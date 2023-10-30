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
  IdType: number;
  IdOrgan: number;
  IdLocation: number;
  Organ: string;
  LocationPosition: string;
  LocationName: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export type CreateEquipmentParams = {
  IdEquipmentExternal: string;
  Name: string;
  Altitude: number;
  Fk_Organ: number;
  Fk_Type: number;
};
export type UpdateEquipmentParams = CreateEquipmentParams & {
  IdEquipment: number;
};

export type GetMetereologicalOrgans = {
  IdOrgan: number;
  Name: string;
  Host: string;
  User: string;
};

export interface EquipmentsRepositoryProtocol {
  getMetereologicalOrgans(): Promise<Array<GetMetereologicalOrgans> | null>;
  createEquipment(equipment: CreateEquipmentParams): Promise<number>;
  updateEquipment(equipment: UpdateEquipmentParams): Promise<void>;
  deleteEquipment(idEquipment: number): Promise<number>;
  checkIfOrganExists(idOrgan: number): Promise<boolean>;
  checkIfEquipmentCodeAlreadyExists(
    idEquipmentExternal: string
  ): Promise<boolean>;
  checkIfEquipmentTypeExists(idType: number): Promise<boolean>;
  getEquipments(pageNumber: number): Promise<Array<Equipment> | null>;
  getStationsReads(
    idEquipment: number,
    pageNumber: number
  ): Promise<Array<StationRead> | null>;
  getPluviometersReads(
    idEquipment: number,
    pageNumber: number
  ): Promise<Array<PluviometerRead> | null>;
}
