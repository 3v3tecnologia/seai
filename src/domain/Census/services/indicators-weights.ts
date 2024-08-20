import { Either, left, right } from "../../../shared/Either";
import { convertBasinsIDsToMask } from "../core/calc-basin-mask";
import { CensusCultureWeights } from "../core/model/indicators-weights";
import { IIndicatorsWeightsRepository } from "../repositories/protocol/weights-repository";

export interface IInsertIndicatorsWeightsController {
  save(params: {
    basin_ids: Array<number>;
    year: number;
    weights: Array<CensusCultureWeights>;
  }): Promise<Either<Error, string>>;
}

export class InsertIndicatorsWeightsService
  implements IInsertIndicatorsWeightsController
{
  constructor(
    private readonly indicatorsWeightsRepository: IIndicatorsWeightsRepository
  ) {}

  async save(params: {
    basin_ids: Array<number>;
    year: number;
    weights: Array<CensusCultureWeights>;
  }): Promise<Either<Error, string>> {
    // validate if basins ids are valid
    const invalidIDs = await this.indicatorsWeightsRepository.checkBasinsIds(
      params.basin_ids
    );

    if (invalidIDs) {
      return left(
        new Error(
          `Não foi possível encontrar a(s) bacia(s) com id ${invalidIDs}`
        )
      );
    }

    const basin_mask = convertBasinsIDsToMask(params.basin_ids);

    const weightsAlreadyExists =
      await this.indicatorsWeightsRepository.checkIfAlreadyExists(
        basin_mask,
        params.year
      );

    if (weightsAlreadyExists) {
      await this.indicatorsWeightsRepository.delete(basin_mask);
    }

    await this.indicatorsWeightsRepository.save(params.weights);

    return right(
      `Sucesso ao adicionar pesos dos indicatores da bacia ${params.basin_ids}`
    );
  }
}
export interface IGetIndicatorsWeightsByBasinService {
  getByBasinsIds(params: {
    basin_ids: Array<number>;
    year: number;
  }): Promise<Either<Error, any | null>>;
}
export class GetIndicatorsWeightsByBasinService
  implements IGetIndicatorsWeightsByBasinService
{
  constructor(
    private readonly indicatorsWeightsRepository: IIndicatorsWeightsRepository
  ) {}

  async getByBasinsIds(params: {
    basin_ids: Array<number>;
    year: number;
  }): Promise<Either<Error, any | null>> {
    const basin_mask = convertBasinsIDsToMask(params.basin_ids);

    const alreadyRecordedWeights =
      await this.indicatorsWeightsRepository.getByMask(basin_mask, params.year);

    if (alreadyRecordedWeights.length) {
      return right(alreadyRecordedWeights);
    }

    const weights = await this.indicatorsWeightsRepository.calculateByBasinMask(
      basin_mask
    );

    return right(weights);
  }
}
export interface ICalculateIndicatorsWeightsService {
  calculate(params: {
    basin_ids: Array<number>;
    area?: number;
    users_registered_count?: number;
    crops_names?: Array<string>;
  }): Promise<Either<Error, any | null>>;
}
export class CalculateIndicatorsWeightsService
  implements ICalculateIndicatorsWeightsService
{
  constructor(
    private readonly indicatorsWeightsRepository: IIndicatorsWeightsRepository
  ) {}

  async calculate(params: {
    basin_ids: Array<number>;
    area?: number;
    users_registered_count?: number;
    crops_names?: Array<string>;
  }): Promise<Either<Error, any | null>> {
    // Utilitário para buscar dados filtrados, será executado após o sistema retornar pela primeira
    // vez os dados de pesos no primeiro acesso dando a possibilidade para o usuário guardar apenas
    // dados específicos.
    const weights = await this.indicatorsWeightsRepository.calculate(params);

    return right(weights);
  }
}
export interface IGetWaterCutService {
  getWaterCut(basin_ids: Array<number>): Promise<Either<Error, any | null>>;
}
export class GetWaterCutService implements IGetWaterCutService {
  constructor(
    private readonly indicatorsWeightsRepository: IIndicatorsWeightsRepository
  ) {}

  async getWaterCut(
    basin_ids: Array<number>,
    year?: number
  ): Promise<Either<Error, any | null>> {
    const basin_mask = convertBasinsIDsToMask(basin_ids);

    const weights = await this.indicatorsWeightsRepository.getWaterCutByBasin(
      basin_mask,
      year
    );

    return right(weights);
  }
}
export interface IGetBasinService {
  getBasin(): Promise<Either<Error, Array<{ id: number; name: string }>>>;
}
export class GetBasinService implements IGetBasinService {
  constructor(
    private readonly indicatorsWeightsRepository: IIndicatorsWeightsRepository
  ) {}

  async getBasin(): Promise<
    Either<Error, Array<{ id: number; name: string }>>
  > {
    const data = await this.indicatorsWeightsRepository.getAllBasin();

    return right(data);
  }
}
