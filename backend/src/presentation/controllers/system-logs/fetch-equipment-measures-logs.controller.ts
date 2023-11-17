import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { FetchEquipmentLogs } from "../../../domain/use-cases/use-cases-logs/fetch-equipment-logs";
import { noContent, ok, serverError } from "../helpers";

export class FetchEquipmentLogsController
  implements Controller<FetchEquipmentLogsController.Request, HttpResponse>
{
  private FetchLogs: FetchEquipmentLogs;

  constructor(FetchLogs: FetchEquipmentLogs) {
    this.FetchLogs = FetchLogs;
  }

  async handle(
    request: FetchEquipmentLogsController.Request
  ): Promise<HttpResponse> {
    try {
      const dto = {
        id: request.id,
        pageNumber: request.pageNumber || 1,
        limit: request.limit,
      };

      if (request.start) {
        Object.assign(dto, {
          time: {
            start: request.start,
            end: request.end || null,
          },
        });
      }
      const result = await this.FetchLogs.execute(dto);

      if (result.isLeft()) {
        return noContent();
      }

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace FetchEquipmentLogsController {
  export type Request = {
    id: number;
    start?: string;
    end?: string | null;
    limit: number;
    pageNumber: number;
  };
}
