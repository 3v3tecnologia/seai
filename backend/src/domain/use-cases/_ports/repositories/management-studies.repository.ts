import { ManagementCensusStudy } from "../../../entities/management/study";
import { InputWithPagination, OutputWithPagination } from "../../helpers/dto";
import { DatabaseOperationOutputLog } from "./dto/output";

export type ManagementStudyToPersistency = {
  Id_Basin: number;
  Id_Culture: number;
  Harvest: number;
  Farm: number;
  ProductivityPerKilo: number;
  ProductivityPerMeters: number; // Consume
};

export namespace ManagementStudiesRepositoryDTO {
  export namespace Create {
    export type Request = Array<ManagementCensusStudy>;

    export type Response = Promise<DatabaseOperationOutputLog | null>;
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
      Promise<OutputWithPagination<ManagementCensusStudy> | null>;
  }

  export namespace GetAllByBasin {
    export type Request = { Id_Basin: number };

    export type Response = Promise<Map<
      string,
      ManagementStudyToPersistency
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
  getAllByBasin(
    request: ManagementStudiesRepositoryDTO.GetAllByBasin.Request
  ): ManagementStudiesRepositoryDTO.GetAllByBasin.Response;
}
