import { WorkersCensusRepositoryProtocol } from "../../../../domain/use-cases/_ports/repositories/workers-census-repository";

import { censusDb } from "../connection/knexfile";

export class DbWorkersCensusRepository
  implements WorkersCensusRepositoryProtocol
{
  async getByBasin(): Promise<Array<any> | null> {
    const data = await censusDb.raw(`
      select
        b."Bacia",
        tr."Tipo",
        round(cast(avg(tr."Trabalhadores") as numeric), 2) as "Média de trabalhadores"
        from
        (
            select
            cd."Localizacao_Id" as "Contato_Id",
            'Pessoa Física' as "Tipo",
            pf."NumTrabalhadores" as "Trabalhadores"
            from
            "PessoaFisica" pf
            inner join
            "Cadastro" cd
            on
            pf."Cad_Id" = cd."Id"
            union all
            select
            cd."Localizacao_Id" as "Contato_Id",
            'Pessoa Jurídica' as "Tipo",
            pj."NumTrabalhadores" as "Trabalhadores"
            from
            "PessoaJuridica" pj
            inner join
            "Cadastro" cd
            on
            pj."Cad_Id" = cd."Id"
        ) as tr
        inner join
        "Contatos" c
        on
        tr."Contato_Id" = c."Id"
        inner join
        "Municipios" m
        on
        m."Id" = c."Municipio_Id"
        inner join
        "Bacias" b
        on
        m."Bacia_Id" = b."Id"
        group by
        b."Bacia", tr."Tipo"
        order by
        "Média de trabalhadores"
        desc
        ;
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Bacia: row.Bacia,
      Tipo: row.Tipo,
      ["Média de trabalhadores"]: Number(row["Média de trabalhadores"]),
    }));
  }
  async getByCounty(): Promise<Array<any> | null> {
    const data = await censusDb.raw(`
      SELECT
        m."Municipio",
        b."Bacia" ,
        tr."Tipo",
        round(
        CAST(
            avg(tr."Trabalhadores") AS NUMERIC
        ),
        2
    ) AS "Média de trabalhadores"
      FROM
              (
              SELECT
                  cd."Localizacao_Id" AS "Contato_Id",
                  'Pessoa Física' AS "Tipo",
                  pf."NumTrabalhadores" AS "Trabalhadores"
              FROM
                  "PessoaFisica" pf
              INNER JOIN
                  "Cadastro" cd
                  ON
                  pf."Cad_Id" = cd."Id"
          UNION ALL
              SELECT
                  cd."Localizacao_Id" AS "Contato_Id",
                  'Pessoa Jurídica' AS "Tipo",
                  pj."NumTrabalhadores" AS "Trabalhadores"
              FROM
                  "PessoaJuridica" pj
              INNER JOIN
                  "Cadastro" cd
                  ON
                  pj."Cad_Id" = cd."Id"
          ) AS tr
      INNER JOIN
              "Contatos" c
              ON
              tr."Contato_Id" = c."Id"
      INNER JOIN
              "Municipios" m
              ON
              m."Id" = c."Municipio_Id"
      INNER JOIN
              "Bacias" b
              ON
              m."Bacia_Id" = b."Id"
      GROUP BY
              m."Municipio",
              b."Bacia",
          tr."Tipo"
      ORDER BY
              "Média de trabalhadores"
              DESC;
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Bacia: row.Bacia,
      Municipio: row.Municipio,
      Tipo: row.Tipo,
      ["Média de trabalhadores"]: Number(row["Média de trabalhadores"]),
    }));
  }
}
