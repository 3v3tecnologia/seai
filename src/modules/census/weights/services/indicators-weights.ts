import { makeGetCropsIndicatorsFromBasin } from './../../crops/services/factories/fetch-by-basin';
import { SecurityIndicatorsUseCaseFactory } from "../../../../server/http/factories";
import { Either, right } from "../../../../shared/Either";
import { CensusCultureWeights } from "../core/model/indicators-weights";
import { makeIndicatorsWeightsRepository } from "../repository/indicators-weights.repository";
import { IIndicatorsWeightsRepository } from "../repository/protocol/repository";


export interface IIndicatorsWeightsServices {
  create(params: {
    id_basin: number;
    weights: Array<CensusCultureWeights>;
  }): Promise<Either<Error, string>>
  getByBasin(params: {
    id_basin: number;
  }): Promise<Either<Error, any | null>>
}

class IndicatorsWeightsServices implements IIndicatorsWeightsServices {
  constructor(private readonly indicatorsWeightsRepository: IIndicatorsWeightsRepository) { }

  async create(params: {
    id_basin: number;
    weights: Array<CensusCultureWeights>;
  }): Promise<Either<Error, string>> {

    await this.indicatorsWeightsRepository.delete(params.id_basin);

    await this.indicatorsWeightsRepository.create(
      {
        id: params.id_basin,
        weights: params.weights
      }
    );

    return right(`Sucesso ao adicionar pesos dos indicatores da bacia ${params.id_basin}`);
  }

  private findMaximumAmongCropIndicators(
    cropIndicators: Map<
      string,
      {
        SocialPerHectare: number;
        SocialPerMeters: number;
        EconomicPerHectare: number;
        EconomicPerMeters: number;
        Consumption: number;
        ProductivityPerHectare: number;
        ProductivityPerMeters: number;
      }
    >
  ) {
    let productivityPerHectare: Array<number> = [];
    let productivityPerMeters: Array<number> = [];
    let profitabilityPerHectare: Array<number> = [];
    let profitabilityPerMeters: Array<number> = [];
    let jobsPerMeters: Array<number> = [];
    let jobsPerHectare: Array<number> = [];
    let consumption: Array<number> = [];

    Array.from(cropIndicators.values()).forEach((indicator) => {
      productivityPerHectare.push(indicator.ProductivityPerHectare);
      productivityPerMeters.push(indicator.ProductivityPerMeters);
      profitabilityPerHectare.push(indicator.EconomicPerHectare);
      profitabilityPerMeters.push(indicator.EconomicPerMeters);
      jobsPerHectare.push(indicator.SocialPerHectare);
      jobsPerMeters.push(indicator.SocialPerMeters);
      consumption.push(indicator.Consumption);
    });

    return {
      productivityPerHectare: Math.max(...productivityPerHectare),
      productivityPerMeters: Math.max(...productivityPerMeters),
      jobsPerHectare: Math.max(...jobsPerHectare),
      jobsPerMeters: Math.max(...jobsPerMeters),
      profitabilityPerHectare: Math.max(...profitabilityPerHectare),
      profitabilityPerMeters: Math.max(...profitabilityPerMeters),
      consumption: Math.max(...consumption),
    };
  }

  async getByBasin(params: {
    id_basin: number;
  }): Promise<Either<Error, any | null>> {
    const weights = await this.indicatorsWeightsRepository.getByBasin({
      id_basin: params.id_basin,
    });

    if (weights == null) {
      return right(null);
    }

    const cropsWeights = new Map<string, any>();

    weights.forEach((weight) => {
      cropsWeights.set(weight.culture, {
        id_basin: weight.id_basin,
        productivity_ha: weight.productivity_ha,
        productivity_m3: weight.productivity_m3,
        profitability_ha: weight.profitability_ha,
        profitability_m3: weight.profitability_m3,
        jobs_ha: weight.jobs_ha,
        jobs_1000m3: weight.jobs_1000m3,
        water_consumption: weight.water_consumption,
      });
    });

    //Pode ser que tenha algum valor nulo no banco (precisa calcular)

    // Se tiver algum valor Nulo, então calcula usando o indicador da cultura

    const culturesIndicatorsResult =
      await makeGetCropsIndicatorsFromBasin().execute(
        {
          IdBasin: params.id_basin,
        }
      );

    let cropCensusIndicators: Map<
      string,
      {
        SocialPerHectare: number;
        SocialPerMeters: number;
        EconomicPerHectare: number;
        EconomicPerMeters: number;
        Consumption: number;
        ProductivityPerHectare: number;
        ProductivityPerMeters: number;
      }
    > | null = null;

    let maximumAmongCulturesIndicators: {
      productivityPerHectare: number;
      productivityPerMeters: number;
      jobsPerHectare: number;
      jobsPerMeters: number;
      profitabilityPerHectare: number;
      profitabilityPerMeters: number;
      consumption: number;
    } = {
      productivityPerHectare: 0,
      productivityPerMeters: 0,
      jobsPerHectare: 0,
      jobsPerMeters: 0,
      profitabilityPerHectare: 0,
      profitabilityPerMeters: 0,
      consumption: 0,
    };

    if (
      culturesIndicatorsResult.isRight() &&
      culturesIndicatorsResult.value?.Cultures
    ) {
      cropCensusIndicators = culturesIndicatorsResult.value.Cultures;

      maximumAmongCulturesIndicators =
        this.findMaximumAmongCropIndicators(cropCensusIndicators);
    }

    const response: Array<any> = [];

    cropsWeights.forEach((cropWeights, cropName) => {
      const cultureIndicator = cropCensusIndicators?.get(cropName);

      if (!cultureIndicator) {
        return;
      }

      if (cropWeights.productivity.get("kg/m³") === null) {
        cropWeights.productivity.set(
          "kg/m³",
          cultureIndicator.ProductivityPerMeters /
          maximumAmongCulturesIndicators.productivityPerMeters
        );
      }

      if (cropWeights.productivity.get("Kg/ha") === null) {
        cropWeights.productivity.set(
          "kg/m³",
          cultureIndicator.ProductivityPerHectare /
          maximumAmongCulturesIndicators.productivityPerHectare
        );
      }

      if (cropWeights.jobs.get("ha") === null) {
        cropWeights.jobs.set(
          "ha",
          cultureIndicator.SocialPerHectare /
          maximumAmongCulturesIndicators.jobsPerHectare
        );
      }

      if (cropWeights.jobs.get("1000m³") === null) {
        cropWeights.jobs.set(
          "1000m³",
          cultureIndicator.SocialPerMeters /
          maximumAmongCulturesIndicators.jobsPerMeters
        );
      }

      if (cropWeights.profitability.get("R$/ha") === null) {
        cropWeights.profitability.set(
          "R$/ha",
          cultureIndicator.EconomicPerHectare /
          maximumAmongCulturesIndicators.jobsPerHectare
        );
      }

      if (cropWeights.profitability.get("R$/m³") === null) {
        cropWeights.profitability.set(
          "R$/m³",
          cultureIndicator.EconomicPerMeters /
          maximumAmongCulturesIndicators.profitabilityPerMeters
        );
      }

      if (cropWeights.waterConsumption.get("m³/ha") === null) {
        cropWeights.waterConsumption.set(
          "m³/ha",
          cultureIndicator.Consumption /
          maximumAmongCulturesIndicators.consumption
        );
      }

      response.push({
        Crop: cropName,
        ProductivityPerHectare: cropWeights.productivity.get("Kg/ha"),
        ProductivityPerMeters: cropWeights.productivity.get("kg/m³") || null,
        ProfitabilityPerHectare: cropWeights.profitability.get("R$/ha"),
        ProfitabilityPerMeters: cropWeights.profitability.get("R$/m³"),
        JobsPerMeters: cropWeights.jobs.get("1000m³"),
        JobsPerHectare: cropWeights.jobs.get("ha"),
        WaterConsumption: cropWeights.waterConsumption.get("m³/ha"),
      });
    });

    return right(response);
  }
}



export const makeIndicatorsWeightsServices = () => new IndicatorsWeightsServices(makeIndicatorsWeightsRepository())