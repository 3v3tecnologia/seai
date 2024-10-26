import { Either } from "../../../../shared/Either";
import { SaveUserIrrigationPreferencesInput, UpdateUserIrrigationPreferencesInput } from "../dto/user-irrigation";


export interface IUserIrrigationPreferencesServices {
  saveIrrigationCrops(
    dto: SaveUserIrrigationPreferencesInput
  ): Promise<Either<Error, number>>;
  updateIrrigationCropsById(
    dto: UpdateUserIrrigationPreferencesInput
  ): Promise<Either<Error, string>>;
  deleteIrrigationCropsById(
    id: number,
    user_id: number
  ): Promise<Either<Error, void>>;
  deleteAllIrrigationCrops(user_id: number): Promise<Either<Error, void>>;
  getIrrigationCropsById(
    id: number,
    user_id: number
  ): Promise<Either<Error, any>>;
  getAllIrrigationCrops(user_id: number): Promise<Either<Error, any>>;
}
