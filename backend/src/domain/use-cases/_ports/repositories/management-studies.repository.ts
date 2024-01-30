import { ManagementCensusStudy } from "../../../entities/management/study";
import { InputWithPagination, OutputWithPagination } from "../../helpers/dto";

export namespace ManagementStudiesRepositoryDTO {
  export namespace Create {
    export type Request = Array<ManagementCensusStudy>;

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
      Array<ManagementCensusStudy>
    > | null>;
  }
}

export interface ManagementStudiesRepositoryProtocol {
  create(
    request: ManagementStudiesRepositoryDTO.Create.Request
  ): ManagementStudiesRepositoryDTO.Create.Response;
  delete(
    request: ManagementStudiesRepositoryDTO.Delete.Request
  ): ManagementStudiesRepositoryDTO.Delete.Response;
  getByBasin(
    request: ManagementStudiesRepositoryDTO.GetByBasin.Request
  ): ManagementStudiesRepositoryDTO.GetByBasin.Response;
}
