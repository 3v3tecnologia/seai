export interface CensusTakersByCountyData {
  County: string;
  Quantity: number;
}

export interface CensusTakersByBasinData {
  Basin: string;
  Quantity: number;
}

export interface CensusTakersRepositoryProtocol {
  getByCounty(): Promise<Array<CensusTakersByCountyData> | null>;
  getByBasin(): Promise<Array<CensusTakersByBasinData> | null>;
}
