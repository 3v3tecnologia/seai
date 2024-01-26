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

  export namespace GetById {
    export type Request = {
      Id: number;
    };

    export type Response = Promise<any | null>;
  }
}

export interface AccessKeyRepositoryProtocol {
  create(
    request: AccessKeyRepositoryDTO.Create.Request
  ): AccessKeyRepositoryDTO.Create.Response;
  update(
    request: AccessKeyRepositoryDTO.Update.Request
  ): AccessKeyRepositoryDTO.Update.Response;
  getById(
    request: AccessKeyRepositoryDTO.GetById.Request
  ): AccessKeyRepositoryDTO.GetById.Response;
}
