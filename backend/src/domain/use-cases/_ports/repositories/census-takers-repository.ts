export interface CensusTakersByCountyData {
  Municipio: string;
  Quantidade: number;
}

export interface CensusTakersByBasinData {
  Bacia: string;
  Quantidade: number;
}

export interface CensusTakersRepositoryProtocol {
  getByCounty(): Promise<Array<CensusTakersByCountyData> | null>;
  getByBasin(): Promise<Array<CensusTakersByBasinData> | null>;
}
