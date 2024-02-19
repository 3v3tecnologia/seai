export type ProducerCultureProfitability = {
  Id: number;
  Profitability: number; // Total
  IdBasin: number;
  Basin: string;
  Cultures: Array<{
    Name: string;
    IrrigatedArea: number;
    CultivationPeriod: number;
  }>;
};

export interface ProducerRepositoryProtocol {
  getProfitabilityGroupByProducer(
    id_basin: number
  ): Promise<Array<ProducerCultureProfitability> | null>;
  getWorkers(id_basin: number): Promise<Map<number, number>>;
  getConsumer(id_basin: number): Promise<Map<number, number>>;
}
