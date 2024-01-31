import {
  ManagementStudiesRepositoryDTO,
  ManagementStudiesRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/management-studies.repository";
import { censusDb } from "../connection/knexfile";
import { withPagination } from "./mapper/WithPagination";

export class DbManagementStudiesRepository
  implements ManagementStudiesRepositoryProtocol
{
  async create(
    request: ManagementStudiesRepositoryDTO.Create.Request
  ): ManagementStudiesRepositoryDTO.Create.Response {
    const result = await censusDb
      .batchInsert("Estudo", request)
      .returning("Id_Bacia");

    console.log("[ManagementStudiesRepository] :: RESULT ", result);
  }

  async delete(
    request: ManagementStudiesRepositoryDTO.Delete.Request
  ): ManagementStudiesRepositoryDTO.Delete.Response {
    const result = await censusDb("Estudo")
      .where({
        Id_Bacia: request.Id_Bacia,
      })
      .del();

    console.log("[ManagementStudiesRepository] :: RESULT ", result);
  }

  async getByBasin(
    request: ManagementStudiesRepositoryDTO.GetByBasin.Request
  ): ManagementStudiesRepositoryDTO.GetByBasin.Response {
    const result = await censusDb
      .select("*")
      .from("Estudo")
      .where({
        Id_Bacia: request.Id_Bacia,
      })
      .limit(request.limit)
      .offset(request.pageNumber);

    console.log("[ManagementStudiesRepository] :: RESULT ", result);

    if (!result.length) {
      return null;
    }

    const data = result.map((row: any) => {
      return {
        Id_Bacia: Number(row.Id_Bacia),
        Id_Cultura: Number(row.Id_Cultura),
        Cultivo: Number(row.Cultivo),
        ProdutividadePorQuilo: Number(row.ProdutividadePorQuilo),
        ProdutividadePorMetros: Number(row.ProdutividadePorMetros),
      };
    });

    return withPagination(data, {
      count: result.length,
      limit: request.limit,
      offset: request.pageNumber,
    });
  }
}
