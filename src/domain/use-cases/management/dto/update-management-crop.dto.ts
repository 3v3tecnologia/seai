export namespace UpdateManagementCropDTO {
  type UpdateManagementCropCyclesInputDTO = {
    stage: number;
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
