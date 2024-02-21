import { BasinIndicatorsByCulture } from "../../../../src/domain/entities/management/basin-indicators-by-culture";
import { GetCulturesIndicatorsFromBasin } from "../../../../src/domain/use-cases/management/get-cultures-indicators-from-basin";
import { InMemoryProducerRepository } from "../../../doubles/repositories/in-memory-producer.repository";

describe("Farms indicators", () => {
  test("Should be able to calculate profitability by producer with monoculture", async function () {
    const producerRepository = new InMemoryProducerRepository({
      profitability: [
        {
          IdProducer: 1667322811535,
          TotalProfitability: 10000,
          IdBasin: 1,
          Basin: "Alto Jaguaribe",
          IrrigatedArea: 4,
          CultivationPeriod: 12,
          IdCulture: 2,
          Culture: "Feijão",
        },
      ],
    });

    const useCase = new GetCulturesIndicatorsFromBasin(producerRepository);

    const resultOrError = await useCase.execute({
      IdBasin: 1,
    });

    expect(resultOrError.isRight());
    expect(resultOrError.value).not.toBe(null);
    expect(resultOrError.value).toBeInstanceOf(BasinIndicatorsByCulture);

    const expected = {
      Id: 1,
      Cultures: new Map([
        [
          "Feijão",
          {
            Social: 3.333333333333333,
            Consumption: 0,
            Economic: 16666.666666666664,
            Productivity: 0,
          },
        ],
      ]),
    };

    const data = resultOrError.value as BasinIndicatorsByCulture;

    expect(data.Id).toEqual(expected.Id);
    expect(data.Cultures).toEqual(expected.Cultures);
  });

  test.skip("Should be able to calculate profitability by producer with monoculture", async function () {
    const producerRepository = new InMemoryProducerRepository({
      profitability: [
        {
          IdProducer: 1667322811535,
          TotalProfitability: 100000,
          IdBasin: 1,
          Basin: "Alto Jaguaribe",
          IrrigatedArea: 2,
          CultivationPeriod: 12,
          IdCulture: 1,
          Culture: "Banana",
        },
        {
          IdProducer: 1667322811535,
          TotalProfitability: 10000,
          IdBasin: 1,
          Basin: "Alto Jaguaribe",
          IrrigatedArea: 4,
          CultivationPeriod: 12,
          IdCulture: 2,
          Culture: "Feijão",
        },
        {
          IdProducer: 1667328714161,
          TotalProfitability: 10000,
          IdBasin: 1,
          Basin: "Alto Jaguaribe",
          IrrigatedArea: 1,
          CultivationPeriod: 6,
          IdCulture: 3,
          Culture: "Banana",
        },
      ],
    });

    const useCase = new GetCulturesIndicatorsFromBasin(producerRepository);

    const resultOrError = await useCase.execute({
      IdBasin: 1,
    });

    expect(resultOrError.isRight());
    expect(resultOrError.value).not.toBe(null);
    expect(resultOrError.value).toBeInstanceOf(BasinIndicatorsByCulture);

    const expected = {
      Id: 1,
      Cultures: new Map([
        [
          "Banana",
          {
            Social: 2.3333333333333335,
            Consumption: 0,
            Economic: 11666.666666666668,
            Productivity: 0,
          },
        ],
        [
          "Feijão",
          {
            Social: 3.333333333333333,
            Consumption: 0,
            Economic: 16666.666666666664,
            Productivity: 0,
          },
        ],
      ]),
    };

    const data = resultOrError.value as BasinIndicatorsByCulture;

    expect(data.Id).toEqual(expected.Id);
    expect(data.Cultures).toEqual(expected.Cultures);
  });
});
