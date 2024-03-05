export namespace ProfitabilitySecurityRepositoryDTO {
  export namespace GetByBasinGroupedByProducer {
    export type Request = number;
    export type Response = Promise<Array<{
      Id: number;
      Profitability: number; // Total
      IdBasin: number;
      Basin: string;
      Cultures: Array<{
        Name: string;
        IrrigatedArea: number;
        CultivationPeriod: number;
      }>;
    }> | null>;
  }
}

export interface ProfitabilitySecurityRepositoryProtocol {
  getByBasinGroupedByProducer(
    basinId: ProfitabilitySecurityRepositoryDTO.GetByBasinGroupedByProducer.Request
  ): ProfitabilitySecurityRepositoryDTO.GetByBasinGroupedByProducer.Response;
}
