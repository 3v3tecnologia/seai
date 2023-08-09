import { CaptationCensusRepositoryProtocol } from "../../../../domain/use-cases/_ports/repositories/captation-repository";
import { censusDb } from "../connection/knexfile";

export class KnexCaptationCensusRepository
  implements CaptationCensusRepositoryProtocol
{
  async getFlowAndVolumeAvgByBasin(): Promise<Array<any> | null> {
    const data = await censusDb.raw(`
      select
        b."Bacia",
        spsb."Mes",
        spsb."Captação",
        round(cast(avg(spsb."Vazao") as numeric), 2) as "Vazão média (m³/h)",
        round(cast(avg(spsb."VolumeMes") as numeric), 2) as "Volume médio (m³)"
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
        where
        spsb."VolumeMes" > 0
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
      ["Vazão média"]: Number(row["Vazão média (m³/h)"]),
      ["Volume médio"]: Number(row["Volume médio (m³)"]),
    }));
  }
  async getFlowAndVolumeAvgByCounty(): Promise<Array<any> | null> {
    const data = await censusDb.raw(`
      select
      m."Municipio",
      spsb."Mes",
      spsb."Captação",
      round(cast(avg(spsb."Vazao") as numeric), 2) as "Vazão média (m³/h)",
      round(cast(avg(spsb."VolumeMes") as numeric), 2) as "Volume médio (m³)"
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
      where
      spsb."VolumeMes" > 0
      group by
      m."Municipio",
      spsb."Mes",
      spsb."Captação"
      ;
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Municipio: row.Municipio,
      Mes: row.Mes,
      ["Captação"]: row["Captação"],
      ["Vazão média"]: Number(row["Vazão média (m³/h)"]),
      ["Volume médio"]: Number(row["Volume médio (m³)"]),
    }));
  }
}
