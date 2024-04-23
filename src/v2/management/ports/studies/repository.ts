import { DatabaseOperationOutputLog } from "../../../../domain/use-cases/_ports/repositories/dto/output";
import { CensusStudy } from "../../entities/study";
export interface ManagementStudiesRepository {
  create(
    request: Array<CensusStudy>,
    id: number
  ): Promise<DatabaseOperationOutputLog | null>;
  delete(id: number): Promise<DatabaseOperationOutputLog>;
  getByBasin(
    id: number
  ): Promise<Map<string, Omit<CensusStudy, "Crop">> | null>;
}
