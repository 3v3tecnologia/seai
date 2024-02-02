import {
  ManagementWeightsRepositoryDTO,
  ManagementWeightsRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/management-weights.repository";
import { managementDb } from "../connection/knexfile";
import { withPagination } from "./mapper/WithPagination";

export class DbManagementWeightsRepository
  implements ManagementWeightsRepositoryProtocol
{
  async create(
    request: ManagementWeightsRepositoryDTO.Create.Request
  ): ManagementWeightsRepositoryDTO.Create.Response {
    const toPersistency = request.Data.map((data) => {
      return {
        Id_Bacia: request.Id_Bacia,
        Id_Cultura: data.Id_Cultura,
        SegurancaProdutivaPorQuilo: data.Produtividade[0],
        SegurancaProdutivaPorMetros: data.Produtividade[1],
        SegurancaEconomicaPorHectar: data.Rentabilidade[0],
        SegurancaEconomicaPorMetros: data.Rentabilidade[1],
        SegurancaSocialPorMetros: data.Empregos[0],
        SegurancaSocialPorHectar: data.Empregos[1],
        SegurancaHidricaPorHectar: data.ConsumoHidrico[0],
        SegurancaHidricaPorMetros: data.ConsumoHidrico[1],
      };
    });

    const result = await managementDb
      .batchInsert("Pesos", toPersistency)
      .returning("Id_Bacia");

    console.log("[ManagementWeightsRepository] :: RESULT ", result);
  }

  async delete(
    request: ManagementWeightsRepositoryDTO.Delete.Request
  ): ManagementWeightsRepositoryDTO.Delete.Response {
    const result = await managementDb("Pesos")
      .where({
        Id_Bacia: request.Id_Bacia,
      })
      .del();

    console.log("[ManagementWeightsRepository] :: RESULT ", result);
  }

  async getByBasin(
    request: ManagementWeightsRepositoryDTO.GetByBasin.Request
  ): ManagementWeightsRepositoryDTO.GetByBasin.Response {
    const result = await managementDb
      .select("*")
      .from("Pesos")
      .where({
        Id_Bacia: request.Id_Bacia,
      })
      .limit(request.limit)
      .offset(
        request.pageNumber ? request.limit * (request.pageNumber - 1) : 0
      );

    if (!result.length) {
      return null;
    }

    const data = result.map((row: any) => {
      return {
        Id_Bacia: Number(row.Id_Bacia),
        Id_Cultura: Number(row.Id_Cultura),
        Indicadores: {
          Produtividade: [
            {
              Valor: Number(row.SegurancaProdutivaPorQuilo) || null,
              Unidade: "Kg/ha",
            },
            {
              Valor: Number(row.SegurancaProdutivaPorMetros) || null,
              Unidade: "kg/m³",
            },
          ],
          Rentabilidade: [
            {
              Valor: Number(row.SegurancaEconomicaPorHectar) || null,
              Unidade: "R$/ha",
            },
            {
              Valor: Number(row.SegurancaEconomicaPorMetros) || null,
              Unidade: "R$/m³",
            },
          ],
          Empregos: [
            {
              Valor: Number(row.SegurancaSocialPorMetros) || null,
              Unidade: "1000m³",
            },
            {
              Valor: Number(row.SegurancaSocialPorHectar) || null,
              Unidade: "ha",
            },
          ],
          ConsumoHidrico: [
            {
              Valor: Number(row.SegurancaHidricaPorMetros) || null,
              Unidade: "m",
            },
            {
              Valor: Number(row.SegurancaHidricaPorHectar) || null,
              Unidade: "ha",
            },
          ],
        },
      };
    });

    return withPagination(data, {
      count: result.length,
      limit: request.limit,
      offset: request.pageNumber,
    });
  }
}
