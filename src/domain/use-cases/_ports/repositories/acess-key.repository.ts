import { ApiKey } from "../../../entities/apiKey/api-key";
import { OldOutputWithPagination, IPaginationInput } from "../../helpers/pagination";

export namespace AccessKeyRepositoryDTO {
  export namespace Create {
    export type Request = {
      Key: string;
      Type: string;
      Enabled: boolean;
    };

    export type Response = Promise<number | null>;
  }

  export namespace Update {
    export type Request = {
      Id: number;
      Key: string;
      Type: string;
      Enabled: boolean;
    };

    export type Response = Promise<void>;
  }
  export namespace Delete {
    export type Request = {
      Id: number;
    };

    export type Response = Promise<void>;
  }

  export namespace GetById {
    export type Request = {
      Id: number;
    };

    export type Response = Promise<Required<ApiKey> | null>;
  }
  export namespace GetAll {
    export type Request = IPaginationInput;
    export type Response = Promise<OldOutputWithPagination<ApiKey> | null>;
  }
  export namespace GetByKey {
    export type Request = {
      Key: string;
    };

    export type Response = Promise<Required<ApiKey> | null>;
  }
}

export interface AccessKeyRepositoryProtocol {
  create(
    request: AccessKeyRepositoryDTO.Create.Request
  ): AccessKeyRepositoryDTO.Create.Response;
  delete(
    request: AccessKeyRepositoryDTO.Delete.Request
  ): AccessKeyRepositoryDTO.Delete.Response;
  update(
    request: AccessKeyRepositoryDTO.Update.Request
  ): AccessKeyRepositoryDTO.Update.Response;
  getById(
    request: AccessKeyRepositoryDTO.GetById.Request
  ): AccessKeyRepositoryDTO.GetById.Response;
  getByKey(
    request: AccessKeyRepositoryDTO.GetByKey.Request
  ): AccessKeyRepositoryDTO.GetByKey.Response;
  getAll(
    request: AccessKeyRepositoryDTO.GetAll.Request
  ): AccessKeyRepositoryDTO.GetAll.Response;
}
