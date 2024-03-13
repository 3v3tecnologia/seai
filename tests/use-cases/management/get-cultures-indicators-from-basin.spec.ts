import { BasinIndicatorsByCulture } from "../../../src/domain/entities/management/basin-indicators-by-culture";
import { GetCropsIndicatorsFromBasin } from "../../../src/domain/use-cases/census";
import { InMemoryStudiesRepository } from "../../doubles/repositories/in-memory-management-studies.repository";
import { InMemoryProfitabilitySecurityRepository } from "../../doubles/repositories/in-memory-profitability.repository";
import { InMemoryWaterSecurityRepository } from "../../doubles/repositories/in-memory-water-security.repository";
import { InMemoryWorkersSecurityRepository } from "../../doubles/repositories/in-memory-workers.repository";

describe("Farms indicators", () => {
  test("Should be able to calculate profitability by producer with monoculture", async function () {
    const profitabilityRepository = new InMemoryProfitabilitySecurityRepository(
      [
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
      ]
    );

    const studiesRepository = new InMemoryStudiesRepository();
    const socialSecurityRepository = new InMemoryWorkersSecurityRepository([]);
    const waterSecurityRepository = new InMemoryWaterSecurityRepository([]);

    const useCase = new GetCropsIndicatorsFromBasin(
      profitabilityRepository,
      socialSecurityRepository,
      waterSecurityRepository,
      studiesRepository
    );

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

  test("Should be able to calculate profitability by producer with monoculture", async function () {
    const profitabilityRepository = new InMemoryProfitabilitySecurityRepository(
      [
        {
          IdProducer: 1674825556279,
          TotalProfitability: 22000,
          IdBasin: 1,
          Basin: "Alto Jaguaribe",
          IrrigatedArea: 0.2,
          CultivationPeriod: 8,
          IdCulture: 1,
          Culture: "CHEIRO VERDE",
        },
        {
          IdProducer: 1674825556279,
          TotalProfitability: 22000,
          IdBasin: 1,
          Basin: "Alto Jaguaribe",
          IrrigatedArea: 0.2,
          CultivationPeriod: 8,
          IdCulture: 2,
          Culture: "BATATA",
        },
        {
          IdProducer: 1674825556279,
          TotalProfitability: 22000,
          IdBasin: 1,
          Basin: "Alto Jaguaribe",
          IrrigatedArea: 0.5,
          CultivationPeriod: 12,
          IdCulture: 2,
          Culture: "BANANA",
        },
        {
          IdProducer: 1674825556279,
          TotalProfitability: 22000,
          IdBasin: 1,
          Basin: "Alto Jaguaribe",
          IrrigatedArea: 0.2,
          CultivationPeriod: 8,
          IdCulture: 2,
          Culture: "ALFACE",
        },
        {
          IdProducer: 1674912212406,
          TotalProfitability: 35000,
          IdBasin: 1,
          Basin: "Alto Jaguaribe",
          IrrigatedArea: 1,
          CultivationPeriod: 12,
          IdCulture: 3,
          Culture: "BANANA",
        },
      ]
    );

    const studiesRepository = new InMemoryStudiesRepository();
    const socialSecurityRepository = new InMemoryWorkersSecurityRepository([]);
    const waterSecurityRepository = new InMemoryWaterSecurityRepository([]);

    const useCase = new GetCropsIndicatorsFromBasin(
      profitabilityRepository,
      socialSecurityRepository,
      waterSecurityRepository,
      studiesRepository
    );

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

    if (data.Cultures) {
      for (const [key, value] of data.Cultures?.entries()) {
        console.log(key, " ", value);
      }
    }
    expect(data.Id).toEqual(expected.Id);
    expect(data.Cultures).toEqual(expected.Cultures);
  });
});
