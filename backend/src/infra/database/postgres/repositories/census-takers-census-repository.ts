import {
  CensusTakersByBasinData,
  CensusTakersByCountyData,
  CensusTakersRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/census-takers-repository";

import { censusDb } from "../connection/knexfile";

export class KnexCensusTakersRepository
  implements CensusTakersRepositoryProtocol
{
  async getByBasin(): Promise<Array<CensusTakersByBasinData> | null> {
    const data = await censusDb.raw(`
      select
        b."Bacia",
        count(b."Bacia") as "Qtd"
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
      group by
        "Bacia"
      order by
        "Qtd"
      desc;
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Basin: row.Bacia,
      Quantity: Number(row.Qtd),
    }));
  }
  async getByCounty(): Promise<Array<CensusTakersByCountyData> | null> {
    const data = await censusDb.raw(`
      select
        m."Municipio",
        count(m."Municipio") as "Qtd"
      from
        "Municipios" m
      inner join
        "RecursoHidrico" rh
      on
        m."Id" = rh."Municipio_Id"
      group by
        "Municipio"
      order by
        "Qtd"
      desc;
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      County: row.Municipio,
      Quantity: Number(row.Qtd),
    }));
  }
}
