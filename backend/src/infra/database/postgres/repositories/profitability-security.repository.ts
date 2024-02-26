import { ProducerRepositoryProtocol } from "../../../../domain/use-cases/_ports/repositories/producer.repository";
import {
  ProfitabilitySecurityRepositoryDTO,
  ProfitabilitySecurityRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/profitability-security.repository";
import { censusDb } from "../connection/knexfile";

export class DbProfitabilitySecurityCensusRepository
  implements ProfitabilitySecurityRepositoryProtocol
{
  async getByBasinGroupedByProducer(
    id_basin: ProfitabilitySecurityRepositoryDTO.GetByBasinGroupedByProducer.Request
  ): ProfitabilitySecurityRepositoryDTO.GetByBasinGroupedByProducer.Response {
    const rawProfitability = await censusDb.raw(
      `
        SELECT
            c."NumCad"  AS "IdProducer",
            ci."Id" AS  "IdCulture",
            ci."Cultura" AS "Culture",
            b."Id" AS "IdBasin",
                b."Bacia" AS "Basin",
                round(
                CAST(
                    sum(ci."AreaIrrigada") AS NUMERIC
                ),
                2
            ) AS "IrrigatedArea",
                    ci."PeriodoCultivo" as "CultivationPeriod",
                round(
                CAST(
                    sum(i."Rentabilidade") AS NUMERIC
                ),
                2
            ) AS "TotalProfitability"
        FROM
                "CulturasIrrigadas" ci
        INNER JOIN
            "Irrigacao" i
            ON
                i."Id" = ci."Irrigacao_Id"
        INNER JOIN
            "Usos" u
            ON
                i."Usos_Id" = u."Id"
        INNER JOIN
            "Cadastro" c
            ON
                c."Id" = u."Cad_Id"
        INNER JOIN
            "Contatos" co
            ON
                co."Id" = c."Localizacao_Id"
        INNER JOIN
            "Municipios" m
            ON
                m."Id" = co."Municipio_Id"
        INNER JOIN
            "Bacias" b
            ON
                m."Bacia_Id" = b."Id"
        WHERE
                "Rentabilidade" IS NOT NULL AND b."Id" = ?
            AND
            ci."AreaIrrigada" > 0
        GROUP BY
                b."Id",
                ci."Id" ,
                ci."PeriodoCultivo" ,
                c."NumCad" 
        ORDER BY
                c."NumCad"
    `,
      [id_basin]
    );

    const rows = rawProfitability.rows;

    if (!rows) {
      return null;
    }

    const result: Map<
      number,
      ProducerRepositoryProtocol.CultureProfitabilityOutput
    > = new Map();

    rows.forEach((raw: any) => {
      const culture = {
        Name: raw.Culture,
        CultivationPeriod: raw.CultivationPeriod,
        IrrigatedArea: raw.IrrigatedArea,
      };

      const register = Number(raw.IdProducer);

      if (result.has(register)) {
        result.get(register)?.Cultures.push(culture);

        return;
      }

      result.set(register, {
        Id: register,
        Basin: raw.Basin,
        IdBasin: raw.IdBasin,
        Profitability: raw.TotalProfitability,
        Cultures: [culture],
      });
    });

    return Array.from(result.values());
  }
}
