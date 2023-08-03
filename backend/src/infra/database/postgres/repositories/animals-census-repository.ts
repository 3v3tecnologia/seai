import {
  AnimalsByBasinData,
  AnimalsByCityData,
  AnimalsConsumptionData,
  AnimalsCensusRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/animal-census-repository";
import { censusDb } from "../connection/knexfile";

export class KnexAnimalsCensusRepository
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
        CreationType: consumption.TipoCriacao,
        Consumption: Number(consumption.Consumo),
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
      Basin: data.Bacia,
      CreationType: data.TipoCriacao,
      Quantity: Number(data.Qtd),
    }));

    const toDomain = {};

    mappedData.forEach(
      (item: { Basin: string; CreationType: string; Quantity: number }) => {
        if (Reflect.has(toDomain, item.Basin)) {
          Reflect.get(toDomain, item.Basin).push({
            CreationType: item.CreationType,
            Quantity: item.Quantity,
          });
        } else {
          Reflect.set(toDomain, item.Basin, [
            {
              ...{
                CreationType: item.CreationType,
                Quantity: item.Quantity,
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
      select
        m."Municipio",
        a."TipoCriacao",
        sum(a."NumCabecasAno") as "Qtd"
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
      "Animais" a
      on
        u."Id" = a."Usos_Id"
      group by
        m."Municipio",
        a."TipoCriacao"
      order by
        "TipoCriacao",
        "Municipio";
    `);

    if (!data.rowCount) {
      return null;
    }

    const mappedData = data.rows.map((data: any) => ({
      County: data.Municipio,
      CreationType: data.TipoCriacao,
      Quantity: Number(data.Qtd),
    }));

    const toDomain = {};

    mappedData.forEach(
      (item: { County: string; CreationType: string; Quantity: number }) => {
        if (Reflect.has(toDomain, item.County)) {
          Reflect.get(toDomain, item.County).push({
            ...{
              CreationType: item.CreationType,
              Quantity: item.Quantity,
            },
          });
        } else {
          Reflect.set(toDomain, item.County, [
            {
              CreationType: item.CreationType,
              Quantity: item.Quantity,
            },
          ]);
        }
      }
    );

    return toDomain;
  }
}
