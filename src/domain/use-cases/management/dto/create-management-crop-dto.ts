export namespace CreateManagementCropDTO {
  type CreateManagementCropCyclesInputDTO = {
    stage: number;
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
