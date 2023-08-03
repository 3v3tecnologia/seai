import {
  AquacultureByBasinData,
  AquacultureByCountyData,
  AquacultureCensusRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/aquaculture-census-repository";
import { censusDb } from "../connection/knexfile";

export class KnexAquacultureCensusRepository
  implements AquacultureCensusRepositoryProtocol
{
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
