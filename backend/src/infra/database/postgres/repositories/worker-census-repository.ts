import { WorkersCensusRepositoryProtocol } from "../../../../domain/use-cases/_ports/repositories/workers-census-repository";

import { censusDb } from "../connection/knexfile";

export class KnexWorkersCensusRepository
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
      select
        m."Municipio",
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
        group by
        m."Municipio", tr."Tipo"
        order by
        "Média de trabalhadores"
        desc;
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Municipio: row.Municipio,
      Tipo: row.Tipo,
      ["Média de trabalhadores"]: Number(row["Média de trabalhadores"]),
    }));
  }
}
