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
  async create(culture: ManagementCrop, author: number): Promise<number | undefined> {
    let cropId: number | undefined

    await governmentDb.transaction(async (trx) => {
      const createCropResult = await trx
        .withSchema("management")
        .insert({
          Name: culture.Name,
          Cycle_Restart_Stage: culture.CycleRestartPoint,
          Is_Permanent: culture.IsPermanent,
          CreatedAt: governmentDb.fn.now(),
        })
        .returning("Id")
        .into("Crop");


      cropId = createCropResult.length ? createCropResult[0]?.Id : undefined;


      await trx.batchInsert(
        "management.Crop_Cycle",
        culture.Cycles.map((cycle) => {
          return {
            FK_Crop: cropId,
            Stage_Title: cycle.Title,
            Start: cycle.Start,
            End: cycle.End,
            KC: cycle.KC,
            Increment: cycle.Increment,
          };
        })
      );

      if (culture.IsPermanent) {
        const firstCycle = await trx
          .withSchema("management")
          .select("Id")
          .from("Crop_Cycle")
          .where({ FK_Crop: cropId })
          .orderBy("Start")
          .first();
        ;
        /**
         * INFO: Quando cadastrar um cultura perene irá por padrão inserir o ciclo para reinício da cultura
         * sendo o primeiro ciclo.
        */
        await trx("Crop")
          .withSchema("management")
          .update({
            Cycle_Restart_Stage: firstCycle.Id,
            UpdatedAt: trx.fn.now(),
          })
          .where({
            Id: cropId,
          });
      }

    });

    if (cropId) {
      await logsDb
        .insert({
          User_Id: author,
          Resource: "crop",
          Operation: "create",
          Description: "Criação da cultura",
        })
        .withSchema("users")
        .into("Operations");
    }

    return cropId

  }

  async update(
    culture: ManagementCrop,
    operation: UserCommandOperationProps
  ): Promise<void> {
    await governmentDb.transaction(async (trx) => {
      await trx("Crop")
        .withSchema("management")
        .update({
          Name: culture.Name,
          Cycle_Restart_Stage: culture.CycleRestartPoint,
          Is_Permanent: culture.IsPermanent,
          UpdatedAt: trx.fn.now(),
        })
        .where({
          Id: culture.Id,
        });

      await trx("Crop_Cycle")
        .withSchema("management")
        .where({ FK_Crop: culture.Id })
        .del();


      await trx.batchInsert(
        "management.Crop_Cycle",
        culture.Cycles.map((cycle) => {
          return {
            FK_Crop: culture.Id,
            Stage_Title: cycle.Title,
            Start: cycle.Start,
            End: cycle.End,
            KC: cycle.KC,
            Increment: cycle.Increment,
          };
        })
      );

      if (culture.IsPermanent) {
        const firstCycle = await trx
          .withSchema("management")
          .select("Id")
          .from("Crop_Cycle")
          .where({ FK_Crop: culture.Id })
          .orderBy("Start")
          .first();
        ;
        /**
         * INFO: Quando cadastrar um cultura perene irá por padrão inserir o ciclo para reinício da cultura
         * sendo o primeiro ciclo.
        */
        await trx("Crop")
          .withSchema("management")
          .update({
            Cycle_Restart_Stage: firstCycle.Id,
            UpdatedAt: trx.fn.now(),
          })
          .where({
            Id: culture.Id,
          });
      }
    })

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

  async addRestartCyclePoint(id_crop: number, id_cycle: number): Promise<void> {
    await governmentDb("Crop")
      .withSchema("management")
      .update({
        Cycle_Restart_Stage: id_cycle,
        UpdatedAt: governmentDb.fn.now(),
      })
      .where({
        Id: id_crop,
      });
  }
  async checkIfCycleExists(id_crop: number, id_cycle: number): Promise<boolean> {
    const data = await governmentDb("Crop_Cycle")
      .withSchema("management")
      .where({
        Id: id_cycle,
        FK_Crop: id_crop
      });

    return data.length > 0 ? true : false
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
  ): Promise<Array<ManagementCropCycle>> {
    const data = await governmentDb
      .withSchema("management")
      .select("*")
      .from("Crop_Cycle")
      .where({ FK_Crop: idCrop })
      .orderBy("Start");


    return data.map((raw: any) => {
      const { Id, Stage_Title, DurationInDays, Start, End, KC, Increment } = raw;

      return {
        Id,
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

  async findCropById(id: number): Promise<ManagementCrop | null> {
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

    const cycles = await this.findCropsCycles(id)

    const cropOrError = ManagementCrop.create({
      Id: rawCrop.Id,
      Name: rawCrop.Name,
      IsPermanent: rawCrop.Is_Permanent,
      CycleRestartPoint: rawCrop.Cycle_Restart_Stage,
      Cycles: cycles
    })

    if (cropOrError.isLeft()) return null


    return cropOrError.value as ManagementCrop
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
        CycleRestartPoint: Cycle_Restart_Stage
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
  ): Promise<Omit<ManagementCropParams, 'Cycles'> | null> {
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
