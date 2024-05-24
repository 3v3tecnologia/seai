
import { formatPaginationInput } from "../../../shared/core/formatPaginationInput";
import { Controller } from "../../../shared/presentation/controllers";
import { HttpResponse, noContent, ok, serverError } from "../../../shared/presentation/http-responses";
import { FetchEquipmentLogs } from "../services";

export class FetchEquipmentLogsController
    implements Controller<FetchEquipmentLogsController.Request, HttpResponse> {
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
                ...formatPaginationInput(request.pageNumber, request.limit),
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
