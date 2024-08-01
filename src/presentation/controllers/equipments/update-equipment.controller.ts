import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { UpdateEquipment } from "../../../domain/use-cases/equipments/update-equipment";
import { badRequest, ok, serverError } from "../helpers";
import { UserOperationControllerDTO } from "../../../@types/login-user";
import { ISchemaValidator } from "../../../shared/validation/validator";

export class UpdateEquipmentsController
  implements
    Controller<UpdateEquipmentsControllerProtocol.Request, HttpResponse>
{
  constructor(
    private updateEquipment: UpdateEquipment,
    private validator: ISchemaValidator
  ) {}

  async handle(
    request: UpdateEquipmentsControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const { Enable, accountId, Operation, id } = request;

      const { error } = await this.validator.validate({
        Enable,
        accountId,
        Operation,
        id,
      });

      if (error) {
        return badRequest(error);
      }

      const resultOrError = await this.updateEquipment.execute(
        {
          IdEquipment: id,
          Enable,
        },
        {
          author: accountId,
          operation: Operation,
        }
      );

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      return ok(resultOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace UpdateEquipmentsControllerProtocol {
  export type Request = {
    id: number;
    Enable: boolean;
  } & UserOperationControllerDTO;
}
