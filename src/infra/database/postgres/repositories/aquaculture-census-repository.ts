import {
  AquacultureByBasinData,
  AquacultureByCountyData,
  AquacultureCensusRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/aquaculture-census-repository";
import { censusDb } from "../connection/knexfile";

export class DbAquacultureCensusRepository
  implements AquacultureCensusRepositoryProtocol
{
  async getMonthlyVolumePerTanksByCounty(): Promise<Array<any> | null> {
    const data = await censusDb.raw(`
    SELECT
      m."Municipio",
      b."Bacia",
      spsb."Mes",
      spsb."Captação",
      sum(a."NumTanques") AS "Tanques",
      round(
        CAST(
          sum(spsb."VolumeMes")/ sum(a."NumTanques") AS NUMERIC
        ),
        2
      ) AS "Volume/tanque (m³)"
    FROM
      (
        SELECT
          sp."Rh_Id" AS "Rh_Id",
          'Superficial' AS "Captação",
          cm.*
        FROM
          "Superficial" sp
        INNER JOIN
                "CaptacaoMedia" cm
                ON
          sp."Captacao_Id" = cm."Id"
      UNION ALL
        SELECT
          sb."Rh_Id" AS "Rh_Id",
          'Subterrânea' AS "Captação",
          cm.*
        FROM
          "Subterranea" sb
        INNER JOIN
                "CaptacaoMedia" cm
                ON
          sb."Captacao_Id" = cm."Id"
      ) AS "spsb"
    INNER JOIN
            "RecursoHidrico" rh
            ON
      rh."Id" = spsb."Rh_Id"
      
    INNER JOIN
            "Municipios" m
            ON
      m."Id" = rh."Municipio_Id"
    INNER JOIN "Bacias" b 
          ON b."Id" = m."Bacia_Id"
    INNER JOIN
            "Cadastro" c
            ON
      c."Id" = rh."Cad_Id"
    INNER JOIN
            "Usos" u
            ON
      u."Cad_Id" = c."Id"
    INNER JOIN
            "Aquiculturas" a
            ON
      u."Id" = a."Usos_Id"
    WHERE
      a."NumTanques" IS NOT NULL
    GROUP BY
      b."Bacia",
      m."Municipio",
      spsb."Mes",
      spsb."Captação";
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Municipio: row.Municipio,
      Bacia: row.Bacia,
      Mes: row.Mes,
      ["Captação"]: row["Captação"],
      Tanques: Number(row.Tanques),
      "Volume/tanque": Number(row["Volume/tanque (m³)"]),
    }));
  }
  async getMonthlyVolumePerTanksByBasin(): Promise<Array<any> | null> {
    const data = await censusDb.raw(`
      select
        b."Bacia",
        spsb."Mes",
        spsb."Captação",
        sum(a."NumTanques") as "Tanques",
        round(cast(sum(spsb."VolumeMes")/sum(a."NumTanques") as numeric), 2) as "Volume/tanque (m³)"
      from
      (
          select
            sp."Rh_Id" as "Rh_Id",
            'Superficial' as "Captação",
            cm.*
          from
          "Superficial" sp
          inner join
          "CaptacaoMedia" cm
          on
          sp."Captacao_Id" = cm."Id"
          union all
          select
          sb."Rh_Id" as "Rh_Id",
          'Subterrânea' as "Captação",
          cm.*
          from
          "Subterranea" sb
          inner join
          "CaptacaoMedia" cm
          on
          sb."Captacao_Id" = cm."Id"
      ) as "spsb"
      inner join
      "RecursoHidrico" rh
      on
      rh."Id" = spsb."Rh_Id"
      inner join
      "Municipios" m
      on
      m."Id" = rh."Municipio_Id"
      inner join
      "Bacias" b
      on
      b."Id" = m."Bacia_Id"
      inner join
      "Cadastro" c
      on
      c."Id" = rh."Cad_Id"
      inner join
      "Usos" u
      on
      u."Cad_Id" = c."Id"
      inner join
      "Aquiculturas" a
      on
      u."Id" = a."Usos_Id"
      where
      a."NumTanques" is not null
      group by
      b."Bacia",
      spsb."Mes",
      spsb."Captação"
      ;
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Bacia: row.Bacia,
      Mes: row.Mes,
      ["Captação"]: row["Captação"],
      Tanques: Number(row.Tanques),
      "Volume/tanque": Number(row["Volume/tanque (m³)"]),
    }));
  }
  async getByBasin(): Promise<Array<AquacultureByBasinData> | null> {
    const data = await censusDb.raw(`
      select
        b."Bacia",
        sum(a."NumTanques") as "Tanques"
      from
        "Bacias" b
      inner join
      "Municipios" m
      on
        b."Id" = m."Bacia_Id"
      inner join
      "RecursoHidrico" rh
      on
        m."Id" = rh."Municipio_Id"
      inner join
      "Cadastro" c
      on
        c."Id" = rh."Cad_Id"
      inner join
      "Usos" u
      on
        u."Cad_Id" = c."Id"
      inner join
      "Aquiculturas" a
      on
        u."Id" = a."Usos_Id"
      where
        a."NumTanques" is not null
      group by
        b."Bacia"
      order by
        "Tanques"
      desc;
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Bacia: row.Bacia,
      Tanques: Number(row.Tanques),
    }));
  }

  async getByCounty(): Promise<Array<AquacultureByCountyData> | null> {
    const data = await censusDb.raw(`
    SELECT
      m."Municipio",
      b."Bacia",
      sum(a."NumTanques") AS "Tanques"
    FROM
      "Municipios" m
    INNER JOIN
        "RecursoHidrico" rh
        ON
      m."Id" = rh."Municipio_Id"
    INNER JOIN
        "Cadastro" c
        ON
      c."Id" = rh."Cad_Id"
    INNER JOIN
        "Usos" u
        ON
      u."Cad_Id" = c."Id"
    INNER JOIN
        "Aquiculturas" a
        ON
      u."Id" = a."Usos_Id"
    INNER JOIN "Bacias" b 
              ON b."Id" = m."Bacia_Id"
    WHERE
      a."NumTanques" IS NOT NULL
    GROUP BY
      b."Bacia",
      m."Municipio"
    ORDER BY
      "Tanques"
        DESC;
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Municipio: row.Municipio,
      Bacia: row.Bacia,
      Tanques: Number(row.Tanques),
    }));
  }
}
