import { Either, right } from "../../../shared/Either";
import { LogRepositoryProtocol } from "../../../modules/User/Government/infra/database/repository/protocol/log-repository";
import { formatPaginationInput } from "../helpers/formatPaginationInput";

export class FetchEquipmentLogs {
  private LIMIT: number = 40;
  private PAGE_NUMBER: number = 0;
  private readonly logRepository: LogRepositoryProtocol;

  constructor(logRepository: LogRepositoryProtocol) {
    this.logRepository = logRepository;
  }
  async execute(
    request: FetchEquipmentLogsUseCaseProtocol.Request
  ): Promise<Either<Error, FetchEquipmentLogsUseCaseProtocol.Response>> {
    const dto = {
      id: request.id,
      ...formatPaginationInput(request.pageNumber, request.limit),
      time: Reflect.has(request, "time") ? request.time! : null,
    };

    const result = await this.logRepository.fetchMeasuresByIdEquipment(dto);

    let pages = result?.count ? Math.ceil(result.count / dto.limit) : 0;

    return right({
      Logs: result?.data || [],
      PageNumber: dto.pageNumber,
      QtdRows: Number(result?.count) || 0,
      PageLimitRows: dto.limit,
      QtdPages: pages,
    });
  }
}

export namespace FetchEquipmentLogsUseCaseProtocol {
  export type Request = {
    id: number;
    time?: {
      start: string;
      end?: string | null;
    } | null;
    limit: number;
    pageNumber: number;
  };

  export type Response = {
    Logs: Array<{
      Time: string;
      Status: string;
      Operation: string;
      Message: string;
    }> | null;
    PageNumber: number;
    QtdRows: number;
    PageLimitRows: number;
    QtdPages: number;
  } | null;
}
