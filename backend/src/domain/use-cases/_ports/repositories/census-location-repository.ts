export interface CensusLocationRepositoryProtocol {
  getCity(): Promise<Array<any> | null>;
  getBasin(): Promise<Array<any> | null>;
}
