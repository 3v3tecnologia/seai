import { ManagementCropCycle } from "../../core/model/crop-cycles";

export namespace ManagementCropDTO {
  export namespace CreateCropCycles {
    export type Input = {
      Id: number;
      AccountId: number;
      Cycles: Array<{
        Title: string;
        DurationInDays: number;
        Start: number;
        End: number;
        KC: number;
        Increment: number;
      }>;
    };

    export type Output = string;
  }

  export namespace DeleteCropCycles {
    export type Input = number;
    export type Output = boolean;
  }

  export namespace GetCropCycles {
    export type Input = number;
    export type Output = Array<ManagementCropCycle> | null;
  }

  export namespace CreateCrop {
    type CreateManagementCropInputDTO = {
      Name: string;
      LocationName: string | null;
      CreatedAt?: string;
      UpdatedAt?: string;
    };

    export type Input = CreateManagementCropInputDTO;
    export type Output = number;
  }
  export namespace DeleteCrop {
    export type Input = number;
    export type Output = boolean;
  }

  export namespace GetCrop {
    export type Input = number;
    export type Output = {
      Id: number;
      Name: string;
      LocationName: string | null;
    } | null;
  }

  export namespace GetAllCrops {
    export type Input = {
      Name?: string;
    };

    export type Output = Array<{
      Id: number;
      Name: string;
      LocationName: string | null;
    }> | null;
  }

  export namespace UpdateCrop {
    type UpdateManagementCropInputDTO = {
      Id: number;
      Name: string;
      LocationName: string | null;
    };

    export type Input = UpdateManagementCropInputDTO;
    export type Output = void;
  }
}
