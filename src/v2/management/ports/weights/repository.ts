import { DatabaseOperationOutputLog } from "../../../../domain/use-cases/_ports/repositories/dto/output";
import { IPaginationInput } from "../../../../domain/use-cases/helpers/pagination";
import { CultureWeights } from "../../entities/weights";

export type CultureWeightsToPersistency = {
  Id_Basin: number;
  Culture: string;
  ProductivityPerHectare: number | null;
  ProductivityPerMeters: number | null;
  ProfitabilityPerHectare: number | null;
  ProfitabilityPerMeters: number | null;
  JobsPerMeters: number | null;
  JobsPerHectare: number | null;
  WaterConsumption: number | null;
};

export namespace ManagementWeightsRepositoryDTO {
  export namespace Create {
    export type Request = Array<CultureWeights>;

    export type Response = Promise<DatabaseOperationOutputLog>;
  }

  export namespace Delete {
    export type Request = {
      id_basin: number;
    };

    export type Response = Promise<DatabaseOperationOutputLog>;
  }

  export namespace GetByBasin {
    export type Request = { id_basin: number } & Partial<IPaginationInput>;

    export type Response = Promise<Array<CultureWeights> | null>;
  }
}

export interface ManagementWeightsRepositoryProtocol {
  create(request: ManagementWeightsRepositoryDTO.Create.Request): Promise<any>;
  delete(
    request: ManagementWeightsRepositoryDTO.Delete.Request
  ): ManagementWeightsRepositoryDTO.Delete.Response;
  getByBasin(
    request: ManagementWeightsRepositoryDTO.GetByBasin.Request
  ): Promise<any>;
}
