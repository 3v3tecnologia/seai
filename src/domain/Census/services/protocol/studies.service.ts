import { Either } from "../../../../shared/Either";
import { CropStudies } from "../../core/model/crop-studies";

export interface ICensusStudiesService {
    create(params: {
        id_basin: number;
        data: Array<Omit<CropStudies, "id_basin">>;
    }): Promise<Either<Error, string>>

    getByBasin(
        id: number
    ): Promise<Either<Error, { [k: string]: Omit<CropStudies, "crop"> } | null>>
}