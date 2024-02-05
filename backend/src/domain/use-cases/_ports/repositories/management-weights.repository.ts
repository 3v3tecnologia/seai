import { ManagementWeights } from "../../../entities/management/weights";
import { InputWithPagination, OutputWithPagination } from "../../helpers/dto";

export namespace ManagementWeightsRepositoryDTO {
  export namespace Create {
    export type Request = {
      Id_Basin: number;
      Data: Array<{
        Id_Culture: number;
        Productivity: Array<number>;
        Profitability: Array<number>;
        Jobs: Array<number>;
        WaterConsumption: Array<number>;
      }>;
    };

    export type Response = Promise<void>;
  }

  export namespace Delete {
    export type Request = {
      Id_Basin: number;
    };

    export type Response = Promise<void>;
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
