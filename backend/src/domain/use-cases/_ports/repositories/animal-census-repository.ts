export interface AnimalsConsumptionData {
  CreationType: string;
  Consumption: number;
}

export interface AnimalsByBasinData {
  [creationType: string]: Array<{
    CreationType: string;
    Quantity: number;
  }>;
}

export interface AnimalsByCityData {
  [county: string]: Array<{
    CreationType: string;
    Quantity: number;
  }>;
}

export interface AnimalsCensusRepositoryProtocol {
  getByCity(): Promise<AnimalsByCityData | null>;
  getByBasin(): Promise<AnimalsByBasinData | null>;
  getConsumption(): Promise<Array<AnimalsConsumptionData> | null>;
}
