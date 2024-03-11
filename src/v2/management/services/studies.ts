import {
  InputWithPagination,
  OutputWithPagination,
} from "../../../domain/use-cases/helpers/dto";
import { formatPaginationInput } from "../../../domain/use-cases/helpers/formatPaginationInput";
import { Either, right } from "../../../shared/Either";
import { ManagementCensusStudy } from "../entities/study";
import { DbManagementStudiesRepository } from "../infra/database/repositories/management-studies.repository";

export class ManagementStudiesUseCases {
  static async create(params: {
    Id_Basin: number;
    Data: Array<ManagementCensusStudy>;
  }): Promise<Either<Error, string>> {
    const deleteLog = await DbManagementStudiesRepository.delete({
      Id_Basin: params.Id_Basin,
    });

    // this.addLog(deleteLog);

    const createLog = await DbManagementStudiesRepository.create(params.Data);

    // this.addLog(createLog);

    return right("Sucesso ao inserir estudos.");
    // return right(createLog.description);
  }
  static async deleteByBasin(params: {
    Id: number;
  }): Promise<Either<Error, string>> {
    const deleteLog = await DbManagementStudiesRepository.delete({
      Id_Basin: params.Id,
    });

    // this.addLog({
    //   action: "delete",
    //   table: DATABASES.NEWSLETTER.SUBSCRIBER,
    //   description: "Usuário deletado com sucesso da lista de emails",
    // });

    return right(deleteLog.description);
  }
  static async getByBasin(
    params: {
      Id_Basin: number;
    } & InputWithPagination
  ): Promise<
    Either<Error, OutputWithPagination<ManagementCensusStudy> | null>
  > {
    const result = await DbManagementStudiesRepository.getByBasin({
      Id_Basin: params.Id_Basin,
      ...formatPaginationInput(params.pageNumber, params.limit),
    });

    return right(result);
  }
}
