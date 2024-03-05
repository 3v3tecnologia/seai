export interface AnimalsConsumptionData {
  TipoCriacao: string;
  Consumo: number;
}

export interface AnimalsByBasinData {
  [creationType: string]: Array<{
    TipoCriacao: string;
    Quantidade: number;
  }>;
}

export interface AnimalsByCityData {
  [county: string]: Array<{
    TipoCriacao: string;
    Quantidade: number;
  }>;
}

export interface AnimalsCensusRepositoryProtocol {
  getByCity(): Promise<AnimalsByCityData | null>;
  getByBasin(): Promise<AnimalsByBasinData | null>;
  getConsumption(): Promise<Array<AnimalsConsumptionData> | null>;
}
