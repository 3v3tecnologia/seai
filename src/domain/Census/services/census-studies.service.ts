import { Either, left, right } from "../../../shared/Either";
import { Logger } from "../../../shared/utils/logger";
import { CropStudies } from "../core/model/crop-studies";
import { ICensusStudiesRepository } from "../infra/repository/protocol/studies-repository";
import { ICensusStudiesService } from "./protocol/studies.service";

export class CensusStudiesService implements ICensusStudiesService {
    constructor(private readonly repository: ICensusStudiesRepository) {
    }
    async create(params: {
        id_basin: number;
        data: Array<Omit<CropStudies, "id_basin">>;
    }): Promise<Either<Error, string>> {
        const basinExists = await this.repository.checkIfBasinExists(
            params.id_basin
        );

        if (basinExists) {
            // TO-DO: check use of batch update
            // CHECK: is possible to create constraints in columns?
            await this.repository.delete(params.id_basin);

            Logger.info(`Sucesso ao deletar estudos da bacia ${params.id_basin}.`);

            await this.repository.create({
                data: params.data,
                id: params.id_basin,
            });

            return right(`Sucesso ao inserir estudos da bacia.`);
        }

        return left(new Error("Bacia não encontrada"));
    }
    async getByBasin(
        id: number
    ): Promise<Either<Error, { [k: string]: Omit<CropStudies, "crop"> } | null>> {
        // TO-DO : get crops from basin
        const studies = await this.repository.getByBasin(id);

        return right(studies);
    }
}
