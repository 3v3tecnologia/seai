export interface WorkersCensusByCountyData {
  County: string;
  Quantity: number;
}

export interface WorkersCensusByBasinData {
  Basin: string;
  Quantity: number;
}

export interface WorkersCensusRepositoryProtocol {
  getByCounty(): Promise<Array<any> | null>;
  getByBasin(): Promise<Array<any> | null>;
}
