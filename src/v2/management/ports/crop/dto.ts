import { ManagementCropParams } from "../../entities/management-crop";

export namespace ManagementCropDTO {
  export namespace Create {
    type CreateManagementCropCyclesInputDTO = {
      title: string;
      durationInDays: number;
      KC: number;
    };

    type CreateManagementCropInputDTO = {
      name: string;
      locationName: string | null;
      cycles: Array<CreateManagementCropCyclesInputDTO>;
      createdAt?: string;
      updatedAt?: string;
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

  export namespace GetById {
    export type Input = {
      id: number;
    };
    export type Output = ManagementCropParams | null;
  }

  export namespace GetAll {
    export type Input = void;
    export type Output = Array<ManagementCropParams> | null;
  }

  export namespace Update {
    type UpdateManagementCropCyclesInputDTO = {
      title: string;
      durationInDays: number;
      KC: number;
    };

    type UpdateManagementCropInputDTO = {
      id: number;
      name: string;
      locationName: string | null;
      cycles: Array<UpdateManagementCropCyclesInputDTO>;
      createdAt?: string;
      updatedAt?: string;
    };

    export type Input = UpdateManagementCropInputDTO;
    export type Output = void;
  }
}
