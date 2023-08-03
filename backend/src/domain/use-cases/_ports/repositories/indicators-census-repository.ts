export interface EconomicSecurityByCountyData {
  County: string;
  IrrigatedArea: number;
  Profitability: number;
  "R$/ha": number;
}

export interface EconomicSecurityByBasinData {
  Basin: string;
  IrrigatedArea: number;
  Profitability: number;
  "R$/ha": number;
}

export interface SocialSecurityByBasinData {
  Basin: string;
  IrrigatedArea: number;
  LegalPersonJobs: number;
  PhysicalPerson: number;
  JobsPerHectare: number;
}

export interface SocialSecurityByCountyData {
  County: string;
  IrrigatedArea: number;
  LegalPersonJobs: number;
  PhysicalPerson: number;
  JobsPerHectare: number;
}

export interface WaterSecurityByBasinData {
  Basin: string;
  TotalConsumption: number;
  IrrigatedArea: number;
  "m³/ha": number;
}

export interface WaterSecurityByCountyData {
  County: string;
  TotalConsumption: number;
  IrrigatedArea: number;
  "m³/ha": number;
}

export interface ProductivitySecurityByBasinData {
  Basin: string;
}

export interface ProductivitySecurityByCountyData {
  County: string;
}

export interface IndicatorsRepositoryProtocol {
  getEconomicSecurityByBasin(): Promise<Array<EconomicSecurityByBasinData> | null>;
  getEconomicSecurityByCounty(): Promise<Array<EconomicSecurityByCountyData> | null>;
  getSocialSecurityByBasin(): Promise<Array<SocialSecurityByBasinData> | null>;
  getSocialSecurityByCounty(): Promise<Array<SocialSecurityByCountyData> | null>;
  getWaterSecurityByBasin(): Promise<Array<WaterSecurityByBasinData> | null>;
  getWaterSecurityByCounty(): Promise<Array<WaterSecurityByCountyData> | null>;
  getProductivitySecurityByBasin(): Promise<null>;
  getProductivitySecurityByCounty(): Promise<null>;
}
