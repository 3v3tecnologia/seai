import { Either, right } from "../../../shared/Either";
import { LogRepositoryProtocol } from "../_ports/repositories/log-repository";

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
    const pageNumber = request.pageNumber
      ? Number(request.pageNumber)
      : this.PAGE_NUMBER;
    const limit = request.limit ? Number(request.limit) : this.LIMIT;
    const time = Reflect.has(request, "time") ? request.time! : null;

    const result = await this.logRepository.fetchMeasuresByIdEquipment({
      id: request.id,
      limit,
      pageNumber,
      time,
    });

    let pages = result?.count ? Math.ceil(result.count / limit) : 0;

    return right({
      Logs: result?.data || [],
      PageNumber: pageNumber,
      QtdRows: Number(result?.count) || 0,
      PageLimitRows: limit,
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
