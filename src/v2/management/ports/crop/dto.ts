import { ManagementCropParams } from "../../entities/crop";

export namespace ManagementCropDTO {
  export namespace Create {
    type CreateManagementCropCyclesInputDTO = {
      Title: string;
      DurationInDays: number;
      Start: number;
      End: number;
      KC: number;
      Increment: number;
    };

    type CreateManagementCropInputDTO = {
      Name: string;
      LocationName: string | null;
      Cycles: Array<CreateManagementCropCyclesInputDTO>;
      CreatedAt?: string;
      UpdatedAt?: string;
    };

    export type Input = CreateManagementCropInputDTO;
    export type Output = number;
  }

  export namespace Delete {
    export type Input = {
      id: number;
    };
    export type Output = boolean;
  }

  export namespace GetCrop {
    export type Input = {
      id: number;
    };
    export type Output = ManagementCropParams | null;
  }
  export namespace GetAll {
    export type Input = void | string;
    export type Output = Array<ManagementCropParams> | null;
  }

  export namespace Update {
    type UpdateManagementCropCyclesInputDTO = {
      Title: string;
      DurationInDays: number;
      Start: number;
      End: number;
      KC: number;
      Increment: number;
    };

    type UpdateManagementCropInputDTO = {
      Id: number;
      Name: string;
      LocationName: string | null;
      Cycles: Array<UpdateManagementCropCyclesInputDTO>;
      CreatedAt?: string;
      UpdatedAt?: string;
    };

    export type Input = UpdateManagementCropInputDTO;
    export type Output = void;
  }
}
