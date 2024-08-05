import { Either } from "../../../../shared/Either";
import {
  ISaveIrrigationRecommendationDTO,
  IUpdateIrrigationRecommendationDTO,
} from "../dto/irrigation";

export interface IUserIrrigationCropsServices {
  saveIrrigationCrops(
    dto: ISaveIrrigationRecommendationDTO
  ): Promise<Either<Error, number>>;
  updateIrrigationCropsById(
    dto: IUpdateIrrigationRecommendationDTO
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
