import { InMemoryProducerRepository } from "../../../doubles/repositories/in-memory-producer.repository";

describe("Producer Repository", () => {
  test("should be able to list profitability grouped by producer when basin id is provided", async () => {
    const basinId = 1;

    const producerRepository = new InMemoryProducerRepository({
      profitability: [
        {
          IdProducer: 1667322811535,
          TotalProfitability: 50000,
          IdBasin: basinId,
          Basin: "Alto Jaguaribe",
          IrrigatedArea: 2,
          CultivationPeriod: 12,
          IdCulture: 1,
          Culture: "Banana",
        },
        {
          IdProducer: 1667322811535,
          TotalProfitability: 50000,
          IdBasin: basinId,
          Basin: "Alto Jaguaribe",
          IrrigatedArea: 4,
          CultivationPeriod: 12,
          IdCulture: 2,
          Culture: "Feijão",
        },
        {
          IdProducer: 1667328714161,
          TotalProfitability: 50000,
          IdBasin: 2,
          Basin: "Baixo Jaguaribe",
          IrrigatedArea: 1,
          CultivationPeriod: 1,
          IdCulture: 3,
          Culture: "Banana",
        },
      ],
    });

    const result = await producerRepository.getProfitabilityGroupByProducer(
      basinId
    );

    expect(result).toHaveLength(1);
    expect(result).toContainEqual({
      Id: 1667322811535,
      Basin: "Alto Jaguaribe",
      IdBasin: 1,
      Profitability: 50000,
      Cultures: [
        { Name: "Banana", CultivationPeriod: 12, IrrigatedArea: 2 },
        { Name: "Feijão", CultivationPeriod: 12, IrrigatedArea: 4 },
      ],
    });
  });
  test("should be able to return 'null' value when basin is not found", async () => {
    const producerRepository = new InMemoryProducerRepository({
      profitability: [],
    });

    const basinId = 1;

    const result = await producerRepository.getProfitabilityGroupByProducer(
      basinId
    );

    expect(result).toBe(null);
  });
});
