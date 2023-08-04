export interface AquacultureByCountyData {
  County: string;
  Tanks: number;
}

export interface AquacultureByBasinData {
  Basin: string;
  Tanks: number;
}

export interface AquacultureCensusRepositoryProtocol {
  getMonthlyVolumePerTanksByCounty(): Promise<Array<any> | null>;
  getMonthlyVolumePerTanksByBasin(): Promise<Array<any> | null>;
  getByCounty(): Promise<Array<AquacultureByCountyData> | null>;
  getByBasin(): Promise<Array<AquacultureByBasinData> | null>;
}
