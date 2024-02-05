import {
  ManagementWeightsRepositoryDTO,
  ManagementWeightsRepositoryProtocol,
} from "../../../src/domain/use-cases/_ports/repositories/management-weights.repository";

export class InMemoryManagementWeightsRepository
  implements ManagementWeightsRepositoryProtocol
{
  create(
    request: ManagementWeightsRepositoryDTO.Create.Request
  ): ManagementWeightsRepositoryDTO.Create.Response {
    throw new Error("Method not implemented.");
  }
  delete(
    request: ManagementWeightsRepositoryDTO.Delete.Request
  ): ManagementWeightsRepositoryDTO.Delete.Response {
    throw new Error("Method not implemented.");
  }
  getByBasin(
    request: ManagementWeightsRepositoryDTO.GetByBasin.Request
  ): ManagementWeightsRepositoryDTO.GetByBasin.Response {
    throw new Error("Method not implemented.");
  }
}
