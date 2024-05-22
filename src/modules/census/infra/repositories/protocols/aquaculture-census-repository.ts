export interface AquacultureByCountyData {
  Municipio: string;
  Tanques: number;
}

export interface AquacultureByBasinData {
  Bacia: string;
  Tanques: number;
}

export interface AquacultureCensusRepositoryProtocol {
  getMonthlyVolumePerTanksByCounty(): Promise<Array<any> | null>;
  getMonthlyVolumePerTanksByBasin(): Promise<Array<any> | null>;
  getByCounty(): Promise<Array<AquacultureByCountyData> | null>;
  getByBasin(): Promise<Array<AquacultureByBasinData> | null>;
}
