import { CultureWeights } from "../../../entities/management/weights";
import { IPaginationInput } from './../../helpers/pagination';
import { DatabaseOperationOutputLog } from "./dto/output";

export type CultureWeightsToPersistency = {
  Id_Basin: number;
  Culture: string;
  ProductivityPerKilo: number | null;
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
      Id_Basin: number;
    };

    export type Response = Promise<DatabaseOperationOutputLog>;
  }

  export namespace GetByBasin {
    export type Request = { Id_Basin: number } & Partial<IPaginationInput>;

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
