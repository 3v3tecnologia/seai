import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { UpdatePluviometerMeasures } from "../../../domain/use-cases/equipments/update-pluviometer-measures";
import { ISchemaValidator } from "../../../shared/validation/validator";
import { badRequest, ok, serverError } from "../helpers";
import { UserOperationControllerDTO } from "../../../@types/login-user";

export class UpdatePluviometerController
  implements
    Controller<UpdateEquipmentsControllerProtocol.Request, HttpResponse>
{
  private updateEquipment: UpdatePluviometerMeasures;
  private validator: ISchemaValidator;

  constructor(
    updateEquipment: UpdatePluviometerMeasures,
    validator: ISchemaValidator
  ) {
    this.updateEquipment = updateEquipment;
    this.validator = validator;
  }

  async handle({
    id,
    accountId,
    Operation,
    Precipitation,
  }: UpdateEquipmentsControllerProtocol.Request): Promise<HttpResponse> {
    try {
      const { error } = await this.validator.validate({
        id: id,
        Precipitation: Precipitation,
        accountId,
        Operation,
      });

      if (error) {
        return badRequest(error);
      }

      const resultOrError = await this.updateEquipment.execute(
        {
          IdRead: id,
          Precipitation,
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
    Precipitation: number | null;
  } & UserOperationControllerDTO;
}
