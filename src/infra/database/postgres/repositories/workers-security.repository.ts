import { ProducerRepositoryProtocol } from "../../../../domain/use-cases/_ports/repositories/producer.repository";
import {
  WorkersSecurityRepositoryDTO,
  WorkersSecurityRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/workers-security.repository";
import { censusDb } from "../connection/knexfile";

export class DbWorkesrSecurityCensusRepository
  implements WorkersSecurityRepositoryProtocol
{
  async getByBasinGroupedByProducer(
    basinId: WorkersSecurityRepositoryDTO.GetByBasinGroupedByProducer.Request
  ): WorkersSecurityRepositoryDTO.GetByBasinGroupedByProducer.Response {
    const rawWorkers = await censusDb.raw(
      `
        SELECT
          c."NumCad" as "Register",
          b."Id" as "IdBasin",
          sum(COALESCE(pf."NumTrabalhadores", 0)) AS "Workers",
          round(
        CAST(
            sum(COALESCE(pf."NumTrabalhadores", 0)) / sum(ci."AreaIrrigada") AS NUMERIC
        ),
          2
            ) AS "WorkersPerHectare"
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
                "PessoaFisica" pf
                ON
                pf."Cad_Id" = c."Id"
        INNER JOIN
                "Bacias" b
                ON
                b."Id" = m."Bacia_Id"
        WHERE
                ci."AreaIrrigada" > 0
            AND b."Id" = ?
        GROUP BY
                b."Id",
                c."NumCad"
        ORDER BY
                c."NumCad"
                DESC;
        `,
      [basinId]
    );

    const data = rawWorkers.rows;

    if (!data) {
      return null;
    }

    const producers = new Map<
      number,
      {
        IdBasin: number;
        Basin: string;
        Workers: number;
      }
    >();

    data.forEach((raw: any) => {
      const registerNumber = Number(raw.Register);

      if (producers.has(registerNumber)) {
        (<
          {
            IdBasin: number;
            Basin: string;
            Workers: number;
          }
        >producers.get(registerNumber)).Workers += Number(raw.Workers);

        return;
      }

      producers.set(registerNumber, {
        IdBasin: raw.IdBasin || null,
        Basin: raw.Basin || null,
        Workers: Number(raw.Workers) || 0,
      });
    });

    return producers;
  }
}
