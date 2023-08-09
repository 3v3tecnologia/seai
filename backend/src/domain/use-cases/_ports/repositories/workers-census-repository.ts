export interface WorkersCensusByCountyData {
  Municipio: string;
  Quantidade: number;
}

export interface WorkersCensusByBasinData {
  Bacia: string;
  Quantidade: number;
}

export interface WorkersCensusRepositoryProtocol {
  getByCounty(): Promise<Array<any> | null>;
  getByBasin(): Promise<Array<any> | null>;
}
