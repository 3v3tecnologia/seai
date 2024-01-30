import { ManagementWeight } from "../../../entities/management/weights";
import { InputWithPagination, OutputWithPagination } from "../../helpers/dto";

export namespace ManagementWeightsRepositoryDTO {
  export namespace Create {
    export type Request = Array<ManagementWeight>;

    export type Response = Promise<void>;
  }

  export namespace Delete {
    export type Request = {
      Id_Bacia: number;
    };

    export type Response = Promise<void>;
  }

  export namespace GetByBasin {
    export type Request = { Id_Bacia: number } & InputWithPagination;

    export type Response = Promise<OutputWithPagination<
      Array<ManagementWeight>
    > | null>;
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
