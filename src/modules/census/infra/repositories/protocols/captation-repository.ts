export interface CaptationByCountyData {
  Municipio: string;
  Mes: number;
  ["Captação"]: number;
  ["Vazão média"]: number;
  ["Volume médio"]: number;
}

export interface CaptationByBasinData {
  Bacia: string;
  Mes: number;
  ["Captação"]: number;
  ["Vazão média"]: number;
  ["Volume médio"]: number;
}

export interface CaptationCensusRepositoryProtocol {
  getFlowAndVolumeAvgByCounty(): Promise<Array<CaptationByCountyData> | null>;
  getFlowAndVolumeAvgByBasin(): Promise<Array<CaptationByBasinData> | null>;
}
