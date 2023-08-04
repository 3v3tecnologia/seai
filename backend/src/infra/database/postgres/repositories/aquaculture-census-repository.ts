import {
  AquacultureByBasinData,
  AquacultureByCountyData,
  AquacultureCensusRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/aquaculture-census-repository";
import { censusDb } from "../connection/knexfile";

export class KnexAquacultureCensusRepository
  implements AquacultureCensusRepositoryProtocol
{
  async getMonthlyVolumePerTanksByCounty(): Promise<Array<AquacultureByBasinData> | null> {
    const data = await censusDb.raw(`
      select
        m."Municipio",
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
        m."Municipio",
        spsb."Mes",
        spsb."Captação";
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Bacia: row.Bacia,
      Mes: row.Mes,
      ["Captação"]: Number(row["Captação"]),
      Tanques: Number(row.Tanques),
      "Volume/tanque": Number(row["Volume/tanque (m³)"]),
    }));
  }
  async getMonthlyVolumePerTanksByBasin(): Promise<Array<AquacultureByBasinData> | null> {
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
      ["Captação"]: Number(row["Captação"]),
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
      Basin: row.Bacia,
      Tanks: Number(row.Tanques),
    }));
  }

  async getByCounty(): Promise<Array<AquacultureByCountyData> | null> {
    const data = await censusDb.raw(`
    select
      m."Municipio",
      sum(a."NumTanques") as "Tanques"
    from
      "Municipios" m
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
      m."Municipio"
    order by
      "Tanques"
    desc;
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      County: row.Municipio,
      Tanks: Number(row.Tanques),
    }));
  }
}
