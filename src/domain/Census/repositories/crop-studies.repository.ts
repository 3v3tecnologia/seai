import { censusDb } from "../../../shared/infra/database/postgres/connection/knexfile";
import { CropStudies } from "../core/model/crop-studies";
import { CropStudiesMapper } from "./mappers/crop-study-mapper";
import { ICensusStudiesRepository } from "./protocol/studies-repository";

export class CensusStudiesRepository implements ICensusStudiesRepository {
  async create(params: {
    data: Array<CropStudies>;
    id: number;
  }): Promise<void> {
    await censusDb.batchInsert(
      "estudos",
      params.data.map((data) =>
        CropStudiesMapper.toPersistency(data, params.id)
      )
    );
    // .returning("bacia_id");
  }

  async delete(id: number): Promise<void> {
    await censusDb("estudos").where("bacia_id", id).del();
  }

  async checkIfBasinExists(id: number): Promise<boolean> {
    const response = await censusDb("bacia")
      .select("id")
      .where("id", id)
      .first();

    return response ? true : false;
  }

  async getByBasin(id: number): Promise<{
    [k: string]: Omit<CropStudies, "crop">;
  } | null> {
    const response = await censusDb
      .select(
        "bacia_id",
        "cultura",
        "safra_meses",
        "cultivo_dias",
        "consumohidrico",
        "produtividade",
        "year"
      )
      .where({
        bacia_id: id,
      })
      .from("estudos");

    if (response.length) {
      const cropMap = this.groupByCrop(response);

      return Object.fromEntries(cropMap);
    }

    return null;
  }

  private groupByCrop(item: any) {
    const groupedByCrop = new Map<string, Omit<CropStudies, "crop">>();

    item.forEach((row: any) => {
      const {
        id_basin,
        crop,
        consumption,
        cultivation_period_in_days,
        harvest_duration_in_months,
        productivity,
        year,
      } = CropStudiesMapper.toDomain(row);

      groupedByCrop.set(crop, {
        id_basin: id_basin,
        harvest_duration_in_months: harvest_duration_in_months || null,
        cultivation_period_in_days: cultivation_period_in_days || null,
        consumption: consumption || null,
        productivity: productivity || null,
        year: year,
      });
    });

    return groupedByCrop;
  }
}

export const makeCensusStudiesRepository = () => new CensusStudiesRepository();
