export namespace WaterSecurityRepositoryDTO {
  type VolumeOutput = Promise<
    Array<{
      Register: number;
      IdBasin: number;
      Volume: number;
    }>
  >;
  export namespace GetSuperficialVolumeGroupedByProducer {
    export type Request = number;

    export type Response = VolumeOutput;
  }

  export namespace GetUnderGroundVolumeGroupedByProducer {
    export type Request = number;

    export type Response = VolumeOutput;
  }
  export namespace GetConsumeFromBasinGroupedByProducer {
    export type Request = number;

    export type Response = Promise<
      Map<
        number,
        {
          IdBasin: number;
          Volumes: Array<number>;
          Consume: number;
        }
      >
    >;
  }
}

export interface WaterSecurityRepositoryProtocol {
  getSuperficialVolumeGroupedByProducer(
    idBasin: WaterSecurityRepositoryDTO.GetSuperficialVolumeGroupedByProducer.Request
  ): WaterSecurityRepositoryDTO.GetSuperficialVolumeGroupedByProducer.Response;
  getUnderGroundVolumeGroupedByProducer(
    idBasin: WaterSecurityRepositoryDTO.GetUnderGroundVolumeGroupedByProducer.Request
  ): WaterSecurityRepositoryDTO.GetUnderGroundVolumeGroupedByProducer.Response;
  getConsumeFromBasinGroupedByProducer(
    idBasin: WaterSecurityRepositoryDTO.GetConsumeFromBasinGroupedByProducer.Request
  ): WaterSecurityRepositoryDTO.GetConsumeFromBasinGroupedByProducer.Response;
}
