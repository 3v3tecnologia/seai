import { DATABASES } from "../../../../../shared/db/tableNames";
import {
  ManagementCrop,
  ManagementCropParams,
} from "../../../entities/management-crop";
import { ManagementCropCycle } from "../../../entities/management-crop-cycles";
import { managementDb } from "../connections/db";

export class DbManagementCropRepository {
  static async create(culture: ManagementCrop): Promise<number | null> {
    let id_crop: number | null = null;

    await managementDb.transaction(async (trx) => {
      const insertedCrop = await managementDb
        .insert({
          Name: culture.name,
          Location_Name: culture?.location || null,
          CreatedAt: managementDb.fn.now(),
        })
        .returning("Id")
        .into(DATABASES.MANAGEMENT.TABLES.CROP);

      id_crop = insertedCrop.length && insertedCrop[0].Id;

      await trx
        .batchInsert(
          DATABASES.MANAGEMENT.TABLES.CROP_CYCLE,
          culture.cycles.map((cycle) => {
            return {
              FK_Crop: id_crop as number,
              Stage_Title: cycle.title,
              Duration_In_Days: cycle.durationInDays,
              KC: cycle.KC,
            };
          })
        )
        .returning("FK_Crop");
    });

    return id_crop;
  }

  static async update(culture: ManagementCrop): Promise<void> {
    await managementDb.transaction(async (trx) => {
      await trx(DATABASES.MANAGEMENT.TABLES.CROP)
        .update({
          Name: culture.name,
          Location_Name: culture.location,
          UpdatedAt: managementDb.fn.now(),
        })
        .where({
          Id: culture.id,
        });

      await trx(DATABASES.MANAGEMENT.TABLES.CROP_CYCLE)
        .where({ FK_Crop: culture.id })
        .del();

      await trx.batchInsert(
        DATABASES.MANAGEMENT.TABLES.CROP_CYCLE,
        culture.cycles.map((cycle) => {
          return {
            FK_Crop: culture.id,
            Stage_Title: cycle.title,
            Duration_In_Days: cycle.durationInDays,
            KC: cycle.KC,
          };
        })
      );
    });
  }

  static async nameExists(crop: string | number): Promise<boolean> {
    const result = await managementDb
      .select("*")
      .from(DATABASES.MANAGEMENT.TABLES.CROP)
      .where({ Name: crop })
      .first();

    if (!result) {
    }

    return !!result;
  }

  static async idExists(crop: string | number): Promise<boolean> {
    const result = await managementDb
      .select("*")
      .from(DATABASES.MANAGEMENT.TABLES.CROP)
      .where({ Id: crop })
      .first();

    return !!result;
  }

  static async delete(idCrop: number): Promise<void> {
    await managementDb(DATABASES.MANAGEMENT.TABLES.CROP)
      .where({ Id: idCrop })
      .del();
  }
  static async findCropById(id: number): Promise<ManagementCropParams | null> {
    const result = await managementDb.raw(
      `
      SELECT * FROM "Crop" c 
      INNER JOIN "Crop_Cycle" cc 
      ON cc."FK_Crop"  = ? 
    `,
      [id]
    );

    const data: any = result?.rows;

    if (!data.length) {
      return null;
    }

    const rawCrop = data[0];

    const cycles: Array<ManagementCropCycle> = data.map((row: any) => {
      return {
        title: row.Stage_Title,
        durationInDays: row.Duration_In_Days,
        KC: row.KC,
      };
    });

    const cropOrError = ManagementCrop.create({
      id: rawCrop.Id,
      name: rawCrop.Name,
      locationName: rawCrop.Location_Name,
      cycles,
    });

    if (cropOrError.isRight()) {
      const crop = cropOrError.value as ManagementCrop;

      return {
        id: crop.id as number,
        name: crop.name,
        locationName: crop.location,
        cycles: crop.cycles,
      };
    }

    return null;
  }
  static async find(): Promise<ManagementCropParams[] | null> {
    const data = await managementDb
      .select("Id", "Name", "Location_Name", "CreatedAt", "UpdatedAt")
      .from(DATABASES.MANAGEMENT.TABLES.CROP);

    if (data.length === 0) {
      return null;
    }

    return data.map((raw: any) => {
      const { Id, Name, Location_Name, CreatedAt, UpdatedAt } = raw;

      return {
        id: Id as number,
        name: Name as string,
        locationName: Location_Name as string,
      };
    });
  }
  static async findCropByName(name: string): Promise<ManagementCrop | null> {
    const result = await managementDb.raw(
      `
      SELECT * FROM "Crop" c 
      INNER JOIN "Crop_Cycle" cc 
      ON c."Name"  = ? 
    `,
      [name]
    );

    const data: any = result?.rows[0];

    if (!data) {
      return null;
    }

    const rawCrop = data;

    const cycles: Array<ManagementCropCycle> = data.map((row: any) => {
      return {
        title: row.Stage_Title,
        durationInDays: row.Duration_In_Days,
        KC: row.KC,
      };
    });

    const crop = ManagementCrop.create({
      name: rawCrop.Name,
      locationName: rawCrop.Location_Name,
      cycles,
    });

    if (crop.isRight()) {
      return crop.value as ManagementCrop;
    }

    return null;
  }
}
