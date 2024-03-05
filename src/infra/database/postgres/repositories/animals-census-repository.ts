import {
  AnimalsByBasinData,
  AnimalsByCityData,
  AnimalsConsumptionData,
  AnimalsCensusRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/animal-census-repository";
import { censusDb } from "../connection/knexfile";

export class DbAnimalsCensusRepository
  implements AnimalsCensusRepositoryProtocol
{
  async getConsumption(): Promise<Array<AnimalsConsumptionData> | null> {
    const consumptions = await censusDb.raw(`select
          "TipoCriacao" as "TipoCriacao",
          round(cast(avg("ConsumoPerCapita") as numeric),
          2) as "Consumo"
        from
          "Animais" a
        where
          "ConsumoPerCapita" > 0
        group by
          "TipoCriacao"
        order by
          "Consumo"
        desc;`);

    if (!consumptions) {
      return null;
    }

    const toDomain = consumptions.rows.map((consumption: any) => {
      return {
        TipoCriacao: consumption.TipoCriacao,
        Consumo: Number(consumption.Consumo),
      };
    });

    return toDomain;
  }
  async getByBasin(): Promise<AnimalsByBasinData | null> {
    const data = await censusDb.raw(`
        select
          b."Bacia",
          a."TipoCriacao",
          sum(a."NumCabecasAno") as "Qtd"
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
        "Animais" a
        on
          u."Id" = a."Usos_Id"
        group by
          b."Bacia",
          a."TipoCriacao"
        order by
          "TipoCriacao",
          "Bacia";
  `);

    if (!data.rowCount) {
      return null;
    }

    const mappedData = data.rows.map((data: any) => ({
      Bacia: data.Bacia,
      TipoCriacao: data.TipoCriacao,
      Quantidade: Number(data.Qtd),
    }));

    const toDomain = {};

    mappedData.forEach(
      (item: { Bacia: string; TipoCriacao: string; Quantidade: number }) => {
        if (Reflect.has(toDomain, item.Bacia)) {
          Reflect.get(toDomain, item.Bacia).push({
            TipoCriacao: item.TipoCriacao,
            Quantidade: item.Quantidade,
          });
        } else {
          Reflect.set(toDomain, item.Bacia, [
            {
              ...{
                TipoCriacao: item.TipoCriacao,
                Quantidade: item.Quantidade,
              },
            },
          ]);
        }
      }
    );

    return toDomain;
  }

  async getByCity(): Promise<AnimalsByCityData | null> {
    const data = await censusDb.raw(`
      SELECT
              b."Bacia" ,
              m."Municipio",
              a."TipoCriacao",
              sum(a."NumCabecasAno") AS "Qtd"
      FROM
              "Municipios" m
      INNER JOIN "Bacias" b 
      ON b."Id" = m."Bacia_Id" 
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
            "Animais" a
            ON
              u."Id" = a."Usos_Id"
      GROUP BY
              b."Bacia" ,
              m."Municipio",
              a."TipoCriacao"
      ORDER BY
              "TipoCriacao",
              "Municipio";
    `);

    if (!data.rowCount) {
      return null;
    }

    const mappedData = data.rows.map((data: any) => ({
      Bacia: data.Bacia,
      Municipio: data.Municipio,
      TipoCriacao: data.TipoCriacao,
      Quantidade: Number(data.Qtd),
    }));

    const toDomain = {};

    mappedData.forEach(
      (item: {
        Bacia: string;
        Municipio: string;
        TipoCriacao: string;
        Quantidade: number;
      }) => {
        if (Reflect.has(toDomain, item.Municipio)) {
          Reflect.get(toDomain, item.Municipio).push({
            ...{
              TipoCriacao: item.TipoCriacao,
              Quantidade: item.Quantidade,
              Bacia: item.Bacia,
            },
          });
        } else {
          Reflect.set(toDomain, item.Municipio, [
            {
              TipoCriacao: item.TipoCriacao,
              Quantidade: item.Quantidade,
              Bacia: item.Bacia,
            },
          ]);
        }
      }
    );

    return toDomain;
  }
}
