import {
  ManagementStudiesRepositoryDTO,
  ManagementStudiesRepositoryProtocol,
  ManagementStudyToPersistency,
} from "../../../src/domain/use-cases/_ports/repositories/management-studies.repository";

export class InMemoryStudiesRepository
  implements ManagementStudiesRepositoryProtocol
{
  public repository: Array<ManagementStudyToPersistency> = [];
  async create(
    request: ManagementStudiesRepositoryDTO.Create.Request
  ): ManagementStudiesRepositoryDTO.Create.Response {
    throw new Error("Method not implemented.");
  }
  async delete(
    request: ManagementStudiesRepositoryDTO.Delete.Request
  ): ManagementStudiesRepositoryDTO.Delete.Response {
    throw new Error("Method not implemented.");
  }
  async getByBasin(
    request: ManagementStudiesRepositoryDTO.GetByBasin.Request
  ): ManagementStudiesRepositoryDTO.GetByBasin.Response {
    throw new Error("Method not implemented.");
  }
  async getAllByBasin(
    request: ManagementStudiesRepositoryDTO.GetAllByBasin.Request
  ): ManagementStudiesRepositoryDTO.GetAllByBasin.Response {
    throw new Error("Method not implemented.");
  }
}
