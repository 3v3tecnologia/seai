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
      Bacia: row.Bacia,
      Quantidade: Number(row.Qtd),
    }));
  }
  async getByCounty(): Promise<Array<CensusTakersByCountyData> | null> {
    const data = await censusDb.raw(`
      SELECT
        m."Municipio",
        b."Bacia" ,
        count(m."Municipio") AS "Qtd"
      FROM
              "Municipios" m
      INNER JOIN "Bacias" b 
      ON b."Id"  = m."Bacia_Id" 
      INNER JOIN
              "RecursoHidrico" rh
            ON
              m."Id" = rh."Municipio_Id"
      GROUP BY
              "Bacia",
              "Municipio"
      ORDER BY
              "Qtd"
            DESC;
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Bacia: row.Bacia,
      Municipio: row.Municipio,
      Quantidade: Number(row.Qtd),
    }));
  }
}
