export interface AnimalsByCityData {
  County: string;
  CreationType: string;
  Quantity: number;
}

export interface AnimalsByBasinData {
  Basin: string;
  CreationType: string;
  Quantity: number;
}

export interface AnimalsConsumptionData {
  CreationType: string;
  Consumption: number;
}

export interface AnimalsCensusRepositoryProtocol {
  getByCity(): Promise<Array<AnimalsByCityData> | null>;
  getByBasin(): Promise<Array<AnimalsByBasinData> | null>;
  getConsumption(): Promise<Array<AnimalsConsumptionData> | null>;
}
