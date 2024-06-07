import { DATABASES } from "../../../shared/db/tableNames";
import { ManagementCrop, ManagementCropParams } from "../core/model/crop";
import { ManagementCropCycle } from "../core/model/crop-cycles";
import { censusDb } from "../../../infra/database/postgres/connection/knexfile";
import { managementDb } from "./connection";

export class DbManagementCropRepository {
  static async createCrop(culture: ManagementCrop): Promise<number | null> {
    const insertedCrop = await managementDb
      .insert({
        Name: culture.Name,
        Location_Name: culture?.Location || null,
        CreatedAt: managementDb.fn.now(),
      })
      .returning("Id")
      .into(DATABASES.MANAGEMENT.TABLES.CROP);

    return insertedCrop.length ? insertedCrop[0]?.Id : null;
  }

  static async updateCrop(culture: ManagementCrop): Promise<void> {
    await managementDb(DATABASES.MANAGEMENT.TABLES.CROP)
      .update({
        Name: culture.Name,
        Location_Name: culture.Location,
        UpdatedAt: managementDb.fn.now(),
      })
      .where({
        Id: culture.Id,
      });
  }

  static async deleteCrop(idCrop: number): Promise<void> {
    await managementDb(DATABASES.MANAGEMENT.TABLES.CROP)
      .where({ Id: idCrop })
      .del();
  }

  static async createCropCycles(
    idCrop: number,
    cycles: Array<ManagementCropCycle>
  ): Promise<void> {
    await managementDb.transaction(async (trx) => {
      await trx(DATABASES.MANAGEMENT.TABLES.CROP_CYCLE)
        .where({ FK_Crop: idCrop })
        .del();

      await trx.batchInsert(
        DATABASES.MANAGEMENT.TABLES.CROP_CYCLE,
        cycles.map((cycle) => {
          return {
            FK_Crop: idCrop,
            Stage_Title: cycle.Title,
            Start: cycle.Start,
            End: cycle.End,
            KC: cycle.KC,
            Increment: cycle.Increment,
          };
        })
      );
    });
  }

  static async findCropsCycles(
    idCrop: number
  ): Promise<Array<ManagementCropCycle> | null> {
    const data = await managementDb
      .select("*")
      .from(DATABASES.MANAGEMENT.TABLES.CROP_CYCLE)
      .where({ FK_Crop: idCrop })
      .orderBy("Start");

    if (data.length === 0) {
      return null;
    }

    return data.map((raw: any) => {
      const { Stage_Title, DurationInDays, Start, End, KC, Increment } = raw;

      return {
        Title: Stage_Title,
        DurationInDays,
        Start,
        End,
        KC,
        Increment,
      };
    });
  }

  static async deleteCropCycles(idCrop: number): Promise<void> {
    await managementDb(DATABASES.MANAGEMENT.TABLES.CROP_CYCLE)
      .where({ FK_Crop: idCrop })
      .del();
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

  static async findCropById(
    id: number
  ): Promise<{ Id: number; Name: string; LocationName: string | null } | null> {
    const result = await managementDb.raw(
      `
      SELECT * FROM "Crop" c 
      WHERE c."Id" = ?
    `,
      [id]
    );

    const data: any = result?.rows;

    if (!data.length) {
      return null;
    }

    const rawCrop = data[0];

    /*const cycles: Array<ManagementCropCycle> = data
      .map((row: any) => {
        return {
          Title: row.Stage_Title,
          DurationInDays: row.Duration_In_Days,
          KC: row.KC,
          Start: row.Start,
          End: row.End,
          Increment: row.Increment,
        };
      })
      .filter((row: ManagementCropCycle) => row.Title !== null);*/

    return {
      Id: rawCrop.Id,
      Name: rawCrop.Name,
      LocationName: rawCrop.Location_Name,
    };
  }

  static async findAllCrops(): Promise<Array<{
    Id: number;
    Name: string;
    LocationName: string | null;
  }> | null> {
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

  static async findCropByName(name: string): Promise<Array<{
    Id: number;
    Name: string;
    LocationName: string | null;
  }> | null> {
    const data = await managementDb.raw(`
      SELECT
          "Id",
          "Name",
          "Location_Name",
          "CreatedAt",
          "UpdatedAt"
      FROM
          "Crop" c
      WHERE
          (
                to_tsvector(
                  'simple',
                  COALESCE(
                      c."Name",
                      ''
                  )
              )
          ) @@ to_tsquery(
              'simple',
              '${name}:*'
          )
    `);

    const dbCrops = data.rows;

    if (dbCrops.length) {
      return dbCrops.map((row: any) => {
        const { Id, Name, Location_Name } = row;
        return {
          Id: Number(Id),
          Name: Name as string,
          LocationName: Location_Name as string,
        };
      });
    }

    return null;
  }

  async findByBasin(id: number): Promise<Array<string> | null> {
    const raw = await censusDb.raw(
      `
    SELECT
        DISTINCT ci."Cultura"
    FROM
        "CulturasIrrigadas" ci
    INNER JOIN "Irrigacao" i 
    ON
        i."Id" = ci."Irrigacao_Id"
    INNER JOIN "Usos" u 
    ON
        u."Id" = i."Usos_Id"
    INNER JOIN "Cadastro" cad 
    ON
        cad."Id" = u."Cad_Id"
    INNER JOIN "Contatos" contato
    ON
        cad."Localizacao_Id" = contato."Id"
    INNER JOIN "Municipios" mun
    ON
        mun."Id" = contato."Municipio_Id"
    INNER JOIN "Bacias" bac 
    ON
        bac."Id" = mun."Bacia_Id"
    WHERE bac."Id" = ?
    GROUP BY ci."Cultura"
    HAVING ci."Cultura" != '-'
    `,
      [id]
    );

    if (!raw.rowCount) {
      return null;
    }

    return raw.rows.map((row: any) => row.Cultura);
  }

  static async checkIfCropNameAlreadyExists(
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
        Id: Number(Id),
        Name: Name as string,
        LocationName: Location_Name as string,
      };
    }

    return null;
  }
}
