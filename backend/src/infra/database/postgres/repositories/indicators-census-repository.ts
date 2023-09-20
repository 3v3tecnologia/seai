import {
  CensusCityLocation,
  CensusLocation,
  EconomicSecurityByBasinData,
  EconomicSecurityByCountyData,
  IndicatorsRepositoryProtocol,
  SocialSecurityByBasinData,
  SocialSecurityByCountyData,
  WaterSecurityByBasinData,
  WaterSecurityByCountyData,
} from "./../../../../domain/use-cases/_ports/repositories/indicators-census-repository";
import { censusDb } from "../connection/knexfile";

export class KnexIndicatorsRepository implements IndicatorsRepositoryProtocol {
  async getCity(): Promise<Array<CensusCityLocation> | null> {
    const cities = await censusDb.raw(
      `select m."Id",m."Municipio",m."Bacia_Id"  from "Municipios" m  `
    );

    if (!cities) {
      return null;
    }

    return cities.rows.map((city: any) => {
      return {
        Id: Number(city.Id),
        Local: city.Municipio,
        IdBacia: city.Bacia_Id,
      };
    });
  }

  async getBasin(): Promise<Array<CensusLocation> | null> {
    const basins = await censusDb.raw(
      `select b."Id",b."Bacia" from "Bacias" b`
    );

    if (!basins) {
      return null;
    }

    return basins.rows.map((basin: any) => {
      return {
        Id: Number(basin.Id),
        Local: basin.Bacia,
      };
    });
  }

  async getEconomicSecurityByBasin(): Promise<Array<EconomicSecurityByBasinData> | null> {
    const data = await censusDb.raw(`
      select
        b."Bacia",
        round(cast(sum(ci."AreaIrrigada") as numeric),
        2) as "AreaIrrigada",
        round(cast(sum(i."Rentabilidade") as numeric),
        2) as "Rentabilidade",
        round(cast(sum(i."Rentabilidade") / sum(ci."AreaIrrigada") as numeric),
        2) as "R$/ha"
      from
        "CulturasIrrigadas" ci
      inner join
      "Irrigacao" i
      on
        i."Id" = ci."Irrigacao_Id"
      inner join
      "Usos" u
      on
        i."Usos_Id" = u."Id"
      inner join
      "Cadastro" c
      on
        c."Id" = u."Cad_Id"
      inner join
      "Contatos" co
      on
        co."Id" = c."Localizacao_Id"
      inner join
      "Municipios" m
      on
        m."Id" = co."Municipio_Id"
      inner join
      "Bacias" b
      on
        m."Bacia_Id" = b."Id"
      where
        "Rentabilidade" is not null
        and
      ci."AreaIrrigada" > 0
      group by
        b."Bacia"
      order by
        "R$/ha"
      desc;
  `);

    if (!data.rowCount) {
      return null;
    }

    const toDomain: Array<EconomicSecurityByBasinData> = data.rows.map(
      (row: any) => ({
        Tipo: "bacia",
        Nome: row.Bacia,
        AreaIrrigada: {
          unidade: "ha",
          valor: Number(row.AreaIrrigada),
        },
        Rentabilidade: {
          unidade: "R$",
          valor: Number(row.Rentabilidade),
        },
        RentabilidadePorArea: Number(row["R$/ha"]),
      })
    );

    return toDomain;
  }

  async getEconomicSecurityByCounty(): Promise<Array<EconomicSecurityByCountyData> | null> {
    const data = await censusDb.raw(`
      select
        m."Municipio",
        round(cast(sum(ci."AreaIrrigada") as numeric),
        2) as "AreaIrrigada",
        round(cast(sum(i."Rentabilidade") as numeric),
        2) as "Rentabilidade",
        round(cast(sum(i."Rentabilidade") / sum(ci."AreaIrrigada") as numeric),
        2) as "R$/ha"
      from
        "CulturasIrrigadas" ci
      inner join
      "Irrigacao" i
      on
        i."Id" = ci."Irrigacao_Id"
      inner join
      "Usos" u
      on
        i."Usos_Id" = u."Id"
      inner join
      "Cadastro" c
      on
        c."Id" = u."Cad_Id"
      inner join
      "Contatos" co
      on
        co."Id" = c."Localizacao_Id"
      inner join
      "Municipios" m
      on
        m."Id" = co."Municipio_Id"
      where
        "Rentabilidade" is not null
        and
      ci."AreaIrrigada" > 0
      group by
        m."Municipio"
      order by
        "R$/ha"
      desc;
    `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Tipo: "municipio",
      Nome: row.Municipio,
      AreaIrrigada: {
        unidade: "ha",
        valor: Number(row.AreaIrrigada),
      },
      Rentabilidade: {
        unidade: "R$",
        valor: Number(row.Rentabilidade),
      },
      RentabilidadePorArea: Number(row["R$/ha"]),
    }));
  }

  async getSocialSecurityByBasin(): Promise<Array<SocialSecurityByBasinData> | null> {
    const data = await censusDb.raw(`
        select
          b."Bacia",
          round(cast(sum(ci."AreaIrrigada") as numeric),
          2) as "AreaIrrigada",
          sum(coalesce(pf."NumTrabalhadores", 0)) as "EmpregosPF",
          sum(coalesce(pj."NumTrabalhadores", 0)) as "EmpregosPJ",
          round(cast(sum(coalesce(pf."NumTrabalhadores", 0)) + sum(coalesce(pj."NumTrabalhadores", 0)) / sum(ci."AreaIrrigada") as numeric),
          2) as "Empregos/ha"
        from
          "CulturasIrrigadas" ci
        inner join
        "Irrigacao" i
        on
          i."Id" = ci."Irrigacao_Id"
        inner join
        "Usos" u
        on
          i."Usos_Id" = u."Id"
        inner join
        "Cadastro" c
        on
          c."Id" = u."Cad_Id"
        inner join
        "Contatos" co
        on
          co."Id" = c."Localizacao_Id"
        inner join
        "Municipios" m
        on
          m."Id" = co."Municipio_Id"
        inner join
        "PessoaFisica" pf
        on
          pf."Cad_Id" = c."Id"
        inner join
        "PessoaJuridica" pj
        on
          pj."Cad_Id" = c."Id"
        inner join
        "Bacias" b
        on
          b."Id" = m."Bacia_Id"
        where
          ci."AreaIrrigada" > 0
        group by
          b."Bacia"
        order by
          "Empregos/ha"
        desc;
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Tipo: "bacia",
      Nome: row.Bacia,
      AreaIrrigada: {
        unidade: "ha",
        valor: Number(row.AreaIrrigada),
      },
      EmpregosPJ: Number(row.EmpregosPJ),
      EmpregosPF: Number(row.EmpregosPF),
      EmpregosPorArea: Number(row["Empregos/ha"]),
    }));
  }

  async getSocialSecurityByCounty(): Promise<Array<SocialSecurityByCountyData> | null> {
    const data = await censusDb.raw(`
        select
          m."Municipio",
          round(cast(sum(ci."AreaIrrigada") as numeric),
          2) as "AreaIrrigada",
          sum(coalesce(pf."NumTrabalhadores", 0)) as "EmpregosPF",
          sum(coalesce(pj."NumTrabalhadores", 0)) as "EmpregosPJ",
          round(cast(sum(coalesce(pf."NumTrabalhadores", 0)) + sum(coalesce(pj."NumTrabalhadores", 0)) / sum(ci."AreaIrrigada") as numeric),
          2) as "Empregos/ha"
        from
          "CulturasIrrigadas" ci
        inner join
        "Irrigacao" i
        on
          i."Id" = ci."Irrigacao_Id"
        inner join
        "Usos" u
        on
          i."Usos_Id" = u."Id"
        inner join
        "Cadastro" c
        on
          c."Id" = u."Cad_Id"
        inner join
        "Contatos" co
        on
          co."Id" = c."Localizacao_Id"
        inner join
        "Municipios" m
        on
          m."Id" = co."Municipio_Id"
        inner join
        "PessoaFisica" pf
        on
          pf."Cad_Id" = c."Id"
        inner join
        "PessoaJuridica" pj
        on
          pj."Cad_Id" = c."Id"
        where
          ci."AreaIrrigada" > 0
        group by
          m."Municipio"
        order by
          "Empregos/ha"
        desc;
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Nome: row.Municipio,
      Tipo: "municipio",
      AreaIrrigada: Number(row.AreaIrrigada),
      EmpregosPJ: Number(row.EmpregosPJ),
      EmpregosPF: Number(row.EmpregosPF),
      EmpregosPorArea: Number(row["Empregos/ha"]),
    }));
  }

  async getWaterSecurityByBasin(): Promise<Array<WaterSecurityByBasinData> | null> {
    const data = await censusDb.raw(`
          WITH AreaIrrigadaPorBacia AS (
          SELECT
            Bacia."Bacia",
            sum(CulturaIrrigada."AreaIrrigada") AS "Área irrigada total"
          FROM
            "CulturasIrrigadas" CulturaIrrigada
            INNER JOIN "Irrigacao" Irrigacao ON Irrigacao."Id" = CulturaIrrigada."Irrigacao_Id"
            INNER JOIN "Usos" Uso ON Uso."Id" = Irrigacao."Usos_Id"
            INNER JOIN "Cadastro" Cad ON Cad."Id" = Uso."Cad_Id"
            INNER JOIN "Contatos" Localizacao ON Localizacao."Id" = Cad."Localizacao_Id"
            INNER JOIN "Municipios" Mun ON Mun."Id" = Localizacao."Municipio_Id"
            INNER JOIN "Bacias" Bacia ON Bacia."Id" = Mun."Bacia_Id"
          GROUP BY
            Bacia."Bacia"
        ),
        ConsumoAnualAguaPorBacia AS (
          SELECT
            Consumos."Bacia",
            (Consumos."Vol_Sup" + Consumos."Vol_Sub") AS "Consumo total"
          FROM
            (
              SELECT
                Bacia."Bacia" AS "Bacia",
                sum(CapMedia."VolumeMes") AS "Vol_Sup",
                (
                  SELECT
                    sum(SubCapMedia."VolumeMes") AS "Volume total"
                  FROM
                    "Subterranea" Sub
                    INNER JOIN "CaptacaoMedia" AS SubCapMedia ON SubCapMedia."Id" = Sub."Captacao_Id"
                    INNER JOIN "RecursoHidrico" RhSub ON RhSub."Id" = Sub."Rh_Id"
                    INNER JOIN "Municipios" SubMun ON SubMun."Id" = RhSub."Municipio_Id"
                    INNER JOIN "Bacias" SubBac ON SubBac."Id" = SubMun."Bacia_Id"
                  WHERE
                    SubBac."Bacia" = Bacia."Bacia"
                  GROUP BY
                    SubBac."Id"
                ) AS "Vol_Sub"
              FROM
                "Superficial" Sup
                INNER JOIN "CaptacaoMedia" CapMedia ON CapMedia."Id" = Sup."Captacao_Id"
                INNER JOIN "RecursoHidrico" RhSup ON RhSup."Id" = Sup."Rh_Id"
                INNER JOIN "Municipios" Mun ON Mun."Id" = RhSup."Municipio_Id"
                INNER JOIN "Bacias" Bacia ON Bacia."Id" = Mun."Bacia_Id"
              GROUP BY
                Bacia."Bacia"
            ) AS Consumos
          ORDER BY
            Consumos."Bacia"
        )
      SELECT
        Consumos."Bacia",
        Consumos."Consumo total" as "ConsumoTotal",
        Consumos."Área irrigada total" as "AreaIrrigadaTotal",
        CASE
          WHEN Consumos."Área irrigada total" > 0 THEN Consumos."Consumo total" / Consumos."Área irrigada total"
          ELSE 0
        END AS "m³/ha"
      FROM
        (
          SELECT
            ConsumoAgua."Consumo total",
            ConsumoAgua."Bacia",
            (
              SELECT
                AreaIrrigada."Área irrigada total"
              FROM
                AreaIrrigadaPorBacia AS AreaIrrigada
              WHERE
                AreaIrrigada."Bacia" = ConsumoAgua."Bacia"
            ) AS "Área irrigada total"
          FROM
            ConsumoAnualAguaPorBacia AS ConsumoAgua
        ) AS Consumos
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Nome: row.Bacia,
      Tipo: "bacia",
      ConsumoTotal: {
        unidade: "m³",
        valor: Number(row.ConsumoTotal),
      },
      AreaIrrigadaTotal: {
        unidade: "ha",
        valor: Number(row.AreaIrrigadaTotal),
      },
      VolumePorArea: Number(row["m³/ha"]),
    }));
  }
  async getWaterSecurityByCounty(): Promise<Array<WaterSecurityByCountyData> | null> {
    const data = await censusDb.raw(`
          WITH ConsumoAnualMunicipio AS (
      SELECT
        Consumos."Município" as "Municipio",
        (Consumos."Vol_Sup" + Consumos."Vol_Sub") AS "Consumo total"
      FROM
        (
          SELECT
            Municipio."Municipio" AS "Município",
            sum(CapMedia."VolumeMes") AS "Vol_Sup",
            (
              SELECT
                sum(CapMedia."VolumeMes") AS "Volume total"
              FROM
                "Subterranea" Sub
                INNER JOIN "CaptacaoMedia" CapMedia ON CapMedia."Id" = Sub."Captacao_Id"
                INNER JOIN "RecursoHidrico" RhSub ON RhSub."Id" = Sub."Rh_Id"
                INNER JOIN "Municipios" Sub_Municipio ON Sub_Municipio."Id" = RhSub."Municipio_Id"
              WHERE
                Sub_Municipio."Municipio" = Municipio."Municipio"
              GROUP BY
                RhSub."Municipio_Id"
            ) AS "Vol_Sub"
          FROM
            "Superficial" Sup
            INNER JOIN "CaptacaoMedia" CapMedia ON CapMedia."Id" = Sup."Captacao_Id"
            INNER JOIN "RecursoHidrico" RhSup ON RhSup."Id" = Sup."Rh_Id"
            INNER JOIN "Municipios" Municipio ON Municipio."Id" = RhSup."Municipio_Id"
          GROUP BY
            Municipio."Municipio"
        ) AS Consumos
      ORDER BY
        Consumos."Município"
    ),
    AreaIrrigadaTotal AS (
      SELECT
        Mun."Municipio",
        sum(CulturaIrrigada."AreaIrrigada") AS "Área irrigada total"
      FROM
        "CulturasIrrigadas" CulturaIrrigada
        INNER JOIN "Irrigacao" Irrigacao ON Irrigacao."Id" = CulturaIrrigada."Irrigacao_Id"
        INNER JOIN "Usos" Uso ON Uso."Id" = Irrigacao."Usos_Id"
        INNER JOIN "Cadastro" Cad ON Cad."Id" = Uso."Cad_Id"
        INNER JOIN "Contatos" Localizacao ON Localizacao."Id" = Cad."Localizacao_Id"
        INNER JOIN "Municipios" Mun ON Mun."Id" = Localizacao."Municipio_Id"
      GROUP BY
        Mun."Municipio"
    )
    SELECT
      Consumos."Municipio",
      Consumos."Consumo total" as "ConsumoTotal",
      Consumos."Área irrigada total" as "AreaIrrigadaTotal",
      CASE
        WHEN Consumos."Área irrigada total" > 0 THEN Consumos."Consumo total" / Consumos."Área irrigada total"
        ELSE 0
      END AS "m³/ha"
    FROM
      (
        SELECT
          ConsumoAgua."Consumo total",
          ConsumoAgua."Municipio",
          (
            SELECT
              AreaIrrigada."Área irrigada total"
            FROM
              AreaIrrigadaTotal AS AreaIrrigada
            WHERE
              AreaIrrigada."Municipio" = ConsumoAgua."Municipio"
          ) AS "Área irrigada total"
        FROM
          ConsumoAnualMunicipio AS consumoAgua
      ) AS Consumos
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Nome: row.Municipio,
      Tipo: "municipio",
      ConsumoTotal: {
        unidade: "m³",
        valor: Number(row.ConsumoTotal),
      },
      AreaIrrigadaTotal: {
        unidade: "ha",
        valor: Number(row.AreaIrrigadaTotal),
      },
      VolumePorArea: Number(row["m³/ha"]),
    }));
  }

  async getProductivitySecurityByBasin(): Promise<null> {
    return null;
  }

  async getProductivitySecurityByCounty(): Promise<null> {
    return null;
  }
}
