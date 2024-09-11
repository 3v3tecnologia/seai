import { Either, left, right } from "../../../shared/Either";
import { convertBasinsIDsToMask } from "../core/calc-basin-mask";
import { CensusCultureWeights } from "../core/model/indicators-weights";
import { IIndicatorsWeightsRepository } from "../repositories/protocol/weights-repository";
import { ICensusWeightsService } from "./protocol/weights.service";

export class CensusWeightsService implements ICensusWeightsService {
    constructor(
        private readonly indicatorsWeightsRepository: IIndicatorsWeightsRepository
    ) { }

    async create(params: {
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

        await this.indicatorsWeightsRepository.save(params.weights, basin_mask);

        return right(
            `Sucesso ao adicionar pesos dos indicatores da bacia ${params.basin_ids}`
        );
    }

    async getBasin(): Promise<
        Either<Error, Array<{ id: number; name: string }>>
    > {
        const data = await this.indicatorsWeightsRepository.getAllBasin();

        return right(data);
    }

    async getByBasinsIds(params: {
        basin_ids: Array<number>;
        year: number;
    }): Promise<Either<Error, any | null>> {
        const basin_mask = convertBasinsIDsToMask(params.basin_ids);

        const weights = await this.indicatorsWeightsRepository.getByMask(
            basin_mask,
            params.year
        );

        return right(weights);
    }

    async calculate(params: {
        basin_ids: Array<number>;
    }): Promise<Either<Error, any | null>> {
        const basin_mask = convertBasinsIDsToMask(params.basin_ids);
        // Utilitário para buscar dados filtrados, será executado após o sistema retornar pela primeira
        // vez os dados de pesos no primeiro acesso dando a possibilidade para o usuário guardar apenas
        // dados específicos.
        const weights = await this.indicatorsWeightsRepository.calculateByBasinMask(
            basin_mask
        );

        return right(weights);
    }

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