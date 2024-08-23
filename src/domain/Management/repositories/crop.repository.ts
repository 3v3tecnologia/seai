import { ManagementCrop, ManagementCropParams } from "../core/model/crop";
import { ManagementCropCycle } from "../core/model/crop-cycles";

import {
  censusDb,
  governmentDb,
  logsDb,
} from "../../../shared/infra/database/postgres/connection/knexfile";
import { UserCommandOperationProps } from "../../Logs/protocols/logger";
import { IManagementCropsRepository } from "./protocols/management-crop.repository";
export class ManagementCropRepository implements IManagementCropsRepository {
  async create(culture: ManagementCrop, author: number): Promise<number | null> {

    const insertedCrop = await governmentDb
      .withSchema("management")
      .insert({
        Name: culture.Name,
        Cycle_Restart_Stage: culture.CycleRestartPoint,
        Is_Permanent: culture.IsPermanent,
        CreatedAt: governmentDb.fn.now(),
      })
      .returning("Id")
      .into("Crop");

    await logsDb
      .insert({
        User_Id: author,
        Resource: "crop",
        Operation: "create",
        Description: "Criação da cultura",
      })
      .withSchema("users")
      .into("Operations");

    return insertedCrop.length ? insertedCrop[0]?.Id : null;
  }

  async update(
    culture: ManagementCrop,
    operation: UserCommandOperationProps
  ): Promise<void> {
    await governmentDb("Crop")
      .withSchema("management")
      .update({
        Name: culture.Name,
        Cycle_Restart_Stage: culture.CycleRestartPoint,
        Is_Permanent: culture.IsPermanent,
        UpdatedAt: governmentDb.fn.now(),
      })
      .where({
        Id: culture.Id,
      });

    await logsDb
      .insert({
        User_Id: operation.author,
        Resource: "crop",
        Operation: "update",
        Description: operation.operation,
      })
      .withSchema("users")
      .into("Operations");
  }

  async delete(
    idCrop: number,
    operation: UserCommandOperationProps
  ): Promise<void> {
    await governmentDb("Crop")
      .withSchema("management")
      .where({ Id: idCrop })
      .del();

    await logsDb
      .insert({
        User_Id: operation.author,
        Resource: "crop",
        Operation: "delete",
        Description: operation.operation,
      })
      .withSchema("users")
      .into("Operations");
  }

  async createCropCycles(
    data: {
      id: number;
      cycles: Array<ManagementCropCycle>;
    },
    author: number
  ): Promise<void> {
    await governmentDb.transaction(async (trx) => {
      await trx("Crop_Cycle")
        .withSchema("management")
        .where({ FK_Crop: data.id })
        .del();

      await trx.batchInsert(
        "management.Crop_Cycle",
        data.cycles.map((cycle) => {
          return {
            FK_Crop: data.id,
            Stage_Title: cycle.Title,
            Start: cycle.Start,
            End: cycle.End,
            KC: cycle.KC,
            Increment: cycle.Increment,
          };
        })
      );
    });

    await logsDb
      .insert({
        User_Id: author,
        Resource: "crop-cycles",
        Operation: "create",
        Description: "Criação do ciclo da cultura",
      })
      .withSchema("users")
      .into("Operations");
  }

  async findCropsCycles(
    idCrop: number
  ): Promise<Array<ManagementCropCycle> | null> {
    const data = await governmentDb
      .withSchema("management")
      .select("*")
      .from("Crop_Cycle")
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

  async deleteCropCycles(
    idCrop: number,
    operation: UserCommandOperationProps
  ): Promise<void> {
    await governmentDb("Crop_Cycle")
      .withSchema("management")
      .where({ FK_Crop: idCrop })
      .del();

    await logsDb
      .insert({
        User_Id: operation.author,
        Resource: "crop-cycles",
        Operation: "delete",
        Description: operation.operation,
      })
      .withSchema("users")
      .into("Operations");
  }

  async nameExists(crop: string): Promise<boolean> {
    const result = await governmentDb
      .withSchema("management")
      .select("*")
      .from("Crop")
      .where({ Name: crop })
      .first();

    return !!result;
  }

  async idExists(crop: number): Promise<boolean> {
    const result = await governmentDb
      .withSchema("management")
      .select("*")
      .from("Crop")
      .where({ Id: crop })
      .first();

    return !!result;
  }



  async findCropById(id: number): Promise<Required<Omit<ManagementCropParams, 'Cycles'>> | null> {
    const result = await governmentDb.raw(
      `
      SELECT * FROM management."Crop" c
      WHERE c."Id" = ?
    `,
      [id]
    );

    const data: any = result?.rows;

    if (!data.length) {
      return null;
    }

    const rawCrop = data[0];

    return {
      Id: rawCrop.Id,
      Name: rawCrop.Name,
      IsPermanent: rawCrop.Is_Permanent,
      CycleRestartPoint: rawCrop.Cycle_Restart_Stage,
    };
  }

  async find(): Promise<Array<Required<Omit<ManagementCropParams, 'Cycles'>>> | null> {
    const data = await governmentDb
      .withSchema("management")
      .select(
        "Id",
        "Name",
        "Cycle_Restart_Stage",
        "Is_Permanent",
        "CreatedAt",
        "UpdatedAt"
      )
      .from("Crop");

    if (data.length === 0) {
      return null;
    }

    return data.map((raw: any) => {
      const {
        Id,
        Name,
        Is_Permanent,
        Cycle_Restart_Stage
      } = raw;

      return {
        Id: Id as number,
        Name: Name as string,
        IsPermanent: Is_Permanent,
        CycleRestartPoint: Cycle_Restart_Stage,
      };
    });
  }

  async findCropByName(name: string): Promise<Array<Required<Omit<ManagementCropParams, 'Cycles'>>> | null> {
    const data = await governmentDb.raw(`
      SELECT
          "Id",
          "Name",
          "Cycle_Restart_Stage",
          "Is_Permanent",
          "CreatedAt",
          "UpdatedAt"
      FROM
          management."Crop" c
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
        const { Id, Name, Is_Permanent, Cycle_Restart_Stage } = row;
        return {
          Id: Number(Id),
          Name: Name as string,
          IsPermanent: Is_Permanent,
          CycleRestartPoint: Cycle_Restart_Stage,
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

  async checkIfStageExists(stage: string): Promise<boolean> {
    const result = await governmentDb
      .withSchema("management")
      .from("Crop_Cycle")
      .where("Stage_Title", stage)
      .first()


    return result ? true : false
  }

  async checkIfThereIsIrrigation(id: number): Promise<boolean> {
    const result = await governmentDb
      .withSchema("management")
      .count("*")
      .from("Irrigation_Crops")
      .where("crop_id", id);

    const count = Number(result[0].count);

    return count > 0;
  }

  async checkIfCropNameAlreadyExists(
    name: string
  ): Promise<ManagementCropParams | null> {
    const dbCrops = await governmentDb
      .withSchema("management")
      .select(
        "Id",
        "Name",
        "Cycle_Restart_Stage",
        "Is_Permanent",
        "CreatedAt",
        "UpdatedAt"
      )
      .where({ Name: name })
      .from("Crop")
      .first();

    if (dbCrops) {
      const { Id, Name, Is_Permanent, Cycle_Restart_Stage } = dbCrops;

      return {
        Id: Number(Id),
        Name: Name as string,
        IsPermanent: Is_Permanent,
        CycleRestartPoint: Cycle_Restart_Stage,
      };
    }

    return null;
  }
}
