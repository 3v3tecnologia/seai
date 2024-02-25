import {
  WorkersSecurityRepositoryDTO,
  WorkersSecurityRepositoryProtocol,
} from "../../../src/domain/use-cases/_ports/repositories/workers-security.repository";

export class InMemoryWorkersSecurityRepository
  implements WorkersSecurityRepositoryProtocol
{
  private _workers: Array<any> = [];

  constructor(workers: Array<any>) {
    this._workers = workers;
  }

  async getByBasinGroupedByProducer(
    basinId: WorkersSecurityRepositoryDTO.GetByBasinGroupedByProducer.Request
  ): WorkersSecurityRepositoryDTO.GetByBasinGroupedByProducer.Response {
    return new Map([
      [
        1667322811535,
        {
          IdBasin: 1,
          Workers: 20,
        },
      ],
      [
        1667328714161,
        {
          IdBasin: 1,
          Workers: 2,
        },
      ],
    ]);
  }
}
