import {
  ManagementWeightsRepositoryDTO,
  ManagementWeightsRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/management-weights.repository";
import { censusDb } from "../connection/knexfile";
import { withPagination } from "./mapper/WithPagination";

export class ManagementWeightsRepository
  implements ManagementWeightsRepositoryProtocol
{
  async create(
    request: ManagementWeightsRepositoryDTO.Create.Request
  ): ManagementWeightsRepositoryDTO.Create.Response {
    const result = await censusDb
      .batchInsert("Pesos", request)
      .returning("Id_Bacia");

    console.log("[ManagementWeightsRepository] :: RESULT ", result);
  }

  async delete(
    request: ManagementWeightsRepositoryDTO.Delete.Request
  ): ManagementWeightsRepositoryDTO.Delete.Response {
    const result = await censusDb
      .where({
        Id_Bacia: request.Id_Bacia,
      })
      .del();

    console.log("[ManagementWeightsRepository] :: RESULT ", result);
  }

  async getByBasin(
    request: ManagementWeightsRepositoryDTO.GetByBasin.Request
  ): ManagementWeightsRepositoryDTO.GetByBasin.Response {
    const result = await censusDb
      .select("*")
      .where({
        Id_Bacia: request.Id_Bacia,
      })
      .limit(request.limit)
      .offset(request.pageNumber);

    console.log("[ManagementWeightsRepository] :: RESULT ", result);

    if (!result.length) {
      return null;
    }

    const data = result.map((row: any) => {
      return {
        Id_Bacia: Number(row.Id_Bacia),
        Id_Cultura: Number(row.Id_Cultura),
        SegurancaProdutivaPorQuilo:
          Number(row.SegurancaProdutivaPorQuilo) || null,
        SegurancaProdutivaPorMetros:
          Number(row.SegurancaProdutivaPorMetros) || null,
        SegurancaEconomicaPorMetros:
          Number(row.SegurancaEconomicaPorMetros) || null,
        SegurancaEconomicaPorHectar:
          Number(row.SegurancaEconomicaPorHectar) || null,
        SegurancaSocialPorMetros: Number(row.SegurancaSocialPorMetros) || null,
        SegurancaSocialPorHectar: Number(row.SegurancaSocialPorHectar) || null,
        SegurancaHidricaPorHectar:
          Number(row.SegurancaHidricaPorHectar) || null,
        SegurancaHidricaPorMetros:
          Number(row.SegurancaHidricaPorMetros) || null,
      };
    });

    return withPagination(data, {
      count: result.length,
      limit: request.limit,
      offset: request.pageNumber,
    });
  }
}
