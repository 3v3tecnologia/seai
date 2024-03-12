import { DATABASES } from "../../../../../shared/db/tableNames";
import { ManagementCrop, ManagementCropParams } from "../../../entities/crop";
import { ManagementCropCycle } from "../../../entities/crop-cycles";
import { managementDb } from "../connections/db";

export class DbManagementCropRepository {
  static async create(culture: ManagementCrop): Promise<number | null> {
    let id_crop: number | null = null;

    await managementDb.transaction(async (trx) => {
      const insertedCrop = await managementDb
        .insert({
          Name: culture.Name,
          Location_Name: culture?.Location || null,
          CreatedAt: managementDb.fn.now(),
        })
        .returning("Id")
        .into(DATABASES.MANAGEMENT.TABLES.CROP);

      id_crop = insertedCrop.length && insertedCrop[0].Id;

      await trx
        .batchInsert(
          DATABASES.MANAGEMENT.TABLES.CROP_CYCLE,
          culture.Cycles.map((cycle) => {
            return {
              FK_Crop: id_crop as number,
              Stage_Title: cycle.Title,
              Duration_In_Days: cycle.DurationInDays,
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
          Name: culture.Name,
          Location_Name: culture.Location,
          UpdatedAt: managementDb.fn.now(),
        })
        .where({
          Id: culture.Id,
        });

      await trx(DATABASES.MANAGEMENT.TABLES.CROP_CYCLE)
        .where({ FK_Crop: culture.Id })
        .del();

      await trx.batchInsert(
        DATABASES.MANAGEMENT.TABLES.CROP_CYCLE,
        culture.Cycles.map((cycle) => {
          return {
            FK_Crop: culture.Id,
            Stage_Title: cycle.Title,
            Duration_In_Days: cycle.DurationInDays,
            KC: cycle.KC,
          };
        })
      );
    });
  }

  static async nameExists(crop: string): Promise<boolean> {
    const result = await managementDb
      .select("*")
      .from(DATABASES.MANAGEMENT.TABLES.CROP)
      .where({ Name: crop })
      .first();

    return !!result;
  }

  static async idExists(crop: number): Promise<boolean> {
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
        Title: row.Stage_Title,
        DurationInDays: row.Duration_In_Days,
        KC: row.KC,
      };
    });

    const cropOrError = ManagementCrop.create({
      Id: rawCrop.Id,
      Name: rawCrop.Name,
      LocationName: rawCrop.Location_Name,
      Cycles: cycles,
    });

    if (cropOrError.isRight()) {
      const crop = cropOrError.value as ManagementCrop;

      return {
        Id: crop.Id as number,
        Name: crop.Name,
        LocationName: crop.Location,
        Cycles: crop.Cycles,
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
        Id: Id as number,
        Name: Name as string,
        LocationName: Location_Name as string,
      };
    });
  }
  static async findCropByName(
    name: string
  ): Promise<ManagementCropParams | null> {
    const dbCrops = await managementDb
      .select("Id", "Name", "Location_Name", "CreatedAt", "UpdatedAt")
      .where({ Name: name })
      .from(DATABASES.MANAGEMENT.TABLES.CROP)
      .first();

    if (dbCrops) {
      const { Id, Name, Location_Name } = dbCrops;

      return {
        Id: Id as number,
        Name: Name as string,
        LocationName: Location_Name as string,
      };
    }

    return null;
  }
}
