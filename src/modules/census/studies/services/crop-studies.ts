import { Either, left, right } from "../../../../shared/Either";
import { CropStudies } from "../core/model/crop-studies";
import { ICensusStudiesRepository } from "../repositories/protocol/repository";

export interface ICreateCropStudiesService {
  create(params: {
    id_basin: number;
    data: Array<Omit<CropStudies, "id_basin">>;
  }): Promise<Either<Error, string>>
}

export class CreateCropStudiesService implements ICreateCropStudiesService {
  private readonly repository: ICensusStudiesRepository

  constructor(repository: ICensusStudiesRepository) {
    this.repository = repository
  }

  async create(params: {
    id_basin: number;
    data: Array<Omit<CropStudies, "id_basin">>;
  }): Promise<Either<Error, string>> {
    const basinExists = await this.repository.checkIfBasinExists(params.id_basin)

    if (basinExists) {
      // TO-DO: check use of batch update
      // CHECK: is possible to create constraints in columns?
      await this.repository.delete(
        params.id_basin
      );

      console.log(`Sucesso ao deletar estudos da bacia ${params.id_basin}.`)

      await this.repository.create({
        data: params.data,
        id: params.id_basin
      });

      return right(`Sucesso ao inserir estudos da bacia.`);
    }

    return left(new Error("Bacia não encontrada"))
  }

}

export interface IGetCropStudiesByBasinService {
  getByBasin(
    id: number
  ): Promise<Either<Error, { [k: string]: Omit<CropStudies, "crop"> } | null>>
}

export class GetCropStudiesByBasinService implements IGetCropStudiesByBasinService {
  private readonly repository: ICensusStudiesRepository

  constructor(repository: ICensusStudiesRepository) {
    this.repository = repository
  }

  async getByBasin(
    id: number
  ): Promise<Either<Error, { [k: string]: Omit<CropStudies, "crop"> } | null>> {
    // TO-DO : get crops from basin
    const studies = await this.repository.getByBasin(id);

    return right(studies);
  }
}

