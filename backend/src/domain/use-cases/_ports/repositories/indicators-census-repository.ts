export interface EconomicSecurityByCountyData {
  Municipio: string;
  AreaIrrigada: number;
  Rentabilidade: number;
  "R$/ha": number;
}

export interface EconomicSecurityByBasinData {
  Bacia: string;
  AreaIrrigada: number;
  Rentabilidade: number;
  "R$/ha": number;
}

export interface SocialSecurityByBasinData {
  Bacia: string;
  AreaIrrigada: number;
  EmpregosPJ: number;
  EmpregosPF: number;
  ["Empregos/ha"]: number;
}

export interface SocialSecurityByCountyData {
  Municipio: string;
  AreaIrrigada: number;
  EmpregosPJ: number;
  EmpregosPF: number;
  ["Empregos/ha"]: number;
}

export interface WaterSecurityByBasinData {
  Bacia: string;
  ConsumoTotal: number;
  AreaIrrigada: number;
  "m³/ha": number;
}

export interface WaterSecurityByCountyData {
  Municipio: string;
  ConsumoTotal: number;
  AreaIrrigada: number;
  "m³/ha": number;
}

export interface ProductivitySecurityByBasinData {
  Bacia: string;
}

export interface ProductivitySecurityByCountyData {
  Municipio: string;
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
