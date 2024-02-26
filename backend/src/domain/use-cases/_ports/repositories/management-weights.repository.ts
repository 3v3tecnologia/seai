import { ManagementWeights } from "../../../entities/management/weights";
import { InputWithPagination, OutputWithPagination } from "../../helpers/dto";
import { DatabaseOperationOutputLog } from "./dto/output";

export type CultureWeightsToPersistency = {
  Id_Basin: number;
  Id_Culture: number;
  ProductivityPerKilo: number | null;
  ProductivityPerMeters: number | null;
  ProfitabilityPerHectare: number | null;
  ProfitabilityPerMeters: number | null;
  JobsPerMeters: number | null;
  JobsPerHectare: number | null;
  WaterConsumptionPerHectare: number | null;
  WaterConsumptionPerMeters: number | null;
};

export namespace ManagementWeightsRepositoryDTO {
  export namespace Create {
    export type Request = Array<ManagementWeights>;

    export type Response = Promise<DatabaseOperationOutputLog>;
  }

  export namespace Delete {
    export type Request = {
      Id_Basin: number;
    };

    export type Response = Promise<DatabaseOperationOutputLog>;
  }

  export namespace GetByBasin {
    export type Request = { Id_Basin: number } & InputWithPagination;

    export type Response =
      Promise<OutputWithPagination<ManagementWeights> | null>;
  }
}

export interface ManagementWeightsRepositoryProtocol {
  create(
    request: ManagementWeightsRepositoryDTO.Create.Request
  ): ManagementWeightsRepositoryDTO.Create.Response;
  delete(
    request: ManagementWeightsRepositoryDTO.Delete.Request
  ): ManagementWeightsRepositoryDTO.Delete.Response;
  getByBasin(
    request: ManagementWeightsRepositoryDTO.GetByBasin.Request
  ): ManagementWeightsRepositoryDTO.GetByBasin.Response;
}
