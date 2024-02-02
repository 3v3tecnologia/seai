import {
  ManagementStudiesRepositoryDTO,
  ManagementStudiesRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/management-studies.repository";
import { managementDb } from "../connection/knexfile";
import { withPagination } from "./mapper/WithPagination";

export class DbManagementStudiesRepository
  implements ManagementStudiesRepositoryProtocol
{
  async create(
    request: ManagementStudiesRepositoryDTO.Create.Request
  ): ManagementStudiesRepositoryDTO.Create.Response {
    const toPersistency = request.Data.map((data) => {
      return {
        Id_Bacia: request.Id_Bacia,
        Id_Cultura: data.Id_Cultura,
        Safra: data.Safra,
        Cultivo: data.Cultivo,
        ProdutividadePorQuilo: data.Produtividade[0],
        ProdutividadePorMetros: data.Produtividade[1],
      };
    });
    const result = await managementDb
      .batchInsert("Estudos", toPersistency)
      .returning("Id_Bacia");

    console.log("[ManagementStudiesRepository] :: RESULT ", result);
  }

  async delete(
    request: ManagementStudiesRepositoryDTO.Delete.Request
  ): ManagementStudiesRepositoryDTO.Delete.Response {
    await managementDb("Estudos").where("Id_Bacia", request.Id_Bacia).del();
  }

  async getByBasin(
    request: ManagementStudiesRepositoryDTO.GetByBasin.Request
  ): ManagementStudiesRepositoryDTO.GetByBasin.Response {
    const result = await managementDb
      .select("*")
      .from("Estudos")
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
        Safra: Number(row.Safra),
        Cultivo: Number(row.Cultivo),
        Produtividade: [
          {
            Valor: Number(row.ProdutividadePorQuilo),
            Unidade: "kg/ha",
          },
          {
            Valor: Number(row.ProdutividadePorMetros),
            Unidadte: "m³/ha",
          },
        ],
      };
    });

    return withPagination(data, {
      count: result.length,
      limit: request.limit,
      offset: request.pageNumber,
    });
  }
}
