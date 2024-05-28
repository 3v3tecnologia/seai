import { IPaginationInput } from "../../../../domain/use-cases/helpers/pagination";
import { censusDb } from "../../../../infra/database/postgres/connection/knexfile";
import { CensusCultureWeights } from "../core/model/indicators-weights";
import { CultureWeightsMapper } from "../core/weights-mapper";
import { IIndicatorsWeightsRepository } from "./protocol/repository";

class IndicatorsWeightsRepository implements IIndicatorsWeightsRepository {
  async create(params: { id: number; weights: Array<CensusCultureWeights> }): Promise<void> {
    await censusDb
      .batchInsert("pesos", params.weights.map((w) => CultureWeightsMapper.toPersistence(w, params.id)))
      .returning("bacia_id");

  }

  async delete(
    id_basin: number
  ): Promise<void> {
    await censusDb("pesos")
      .where({
        bacia_id: id_basin,
      })
      .del();
  }

  async getByBasin(
    params: { id_basin: number } & Partial<IPaginationInput>
  ): Promise<Array<CensusCultureWeights> | null> {
    const query = censusDb
      .select("*")
      .from("pesos")
      .where({
        bacia_id: params.id_basin,
      });

    if (params.limit && params.pageNumber) {
      query.limit(params.limit).offset(params.pageNumber);
    }

    const result = await query;

    if (!result.length) {
      return null;
    }

    const weights = result.map((row: any) =>
      CultureWeightsMapper.toDomain(row)
    );

    return weights;
  }
}

export const makeIndicatorsWeightsRepository = () => new IndicatorsWeightsRepository()