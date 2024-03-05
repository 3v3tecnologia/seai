export namespace WorkersSecurityRepositoryDTO {
  export namespace GetByBasinGroupedByProducer {
    export type Request = number;
    export type Response = Promise<Map<
      number,
      {
        IdBasin: number;
        Workers: number;
      }
    > | null>;
  }
}

export interface WorkersSecurityRepositoryProtocol {
  getByBasinGroupedByProducer(
    basinId: WorkersSecurityRepositoryDTO.GetByBasinGroupedByProducer.Request
  ): WorkersSecurityRepositoryDTO.GetByBasinGroupedByProducer.Response;
}
