import { ProducerRepositoryProtocol } from "../../../../domain/use-cases/_ports/repositories/producer.repository";
import { censusDb } from "../connection/knexfile";

export class DbProducerRepository
  implements ProducerRepositoryProtocol.Repository
{
  async getProfitabilityGroupByProducer(
    id_basin: number
  ): Promise<ProducerRepositoryProtocol.CultureProfitabilityOutput[] | null> {
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
  async getWorkers(
    id_basin: number
  ): Promise<ProducerRepositoryProtocol.WorkersOutput | null> {
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
      [id_basin]
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
        >producers.get(registerNumber)).Workers += raw.Workers;

        return;
      }

      producers.set(registerNumber, {
        IdBasin: raw.IdBasin || null,
        Basin: raw.Basin || null,
        Workers: raw.Workers || 0,
      });
    });

    return producers;
  }

  async getSuperficialVolume(
    basinId: number
  ): Promise<ProducerRepositoryProtocol.VolumeByProducerOutput> {
    const rawSuperficial = await censusDb.raw(
      `
        SELECT
		    Cad."NumCad" AS "Register",
            Bacia."Id" AS "IdBasin",
		    sum(SupCapMedia."VolumeMes") AS "Volume"
                FROM
                    "Superficial" Sup
                INNER JOIN "CaptacaoMedia" AS SupCapMedia ON
                    SupCapMedia."Id" = Sup."Captacao_Id"
                INNER JOIN "RecursoHidrico" RhSup ON
                    RhSup."Id" = Sup."Rh_Id"
                INNER JOIN "Cadastro" AS Cad
                	ON Cad."Id"  = RhSup."Cad_Id" 
                INNER JOIN "Municipios" SupMun ON
                    SupMun."Id" = RhSup."Municipio_Id"
                 INNER JOIN "Bacias" Bacia ON
            Bacia."Id" = SupMun."Bacia_Id"
           	WHERE bacia."Id" = ?
                GROUP BY
                	Bacia."Id",
                	SupMun."Id",
                    Cad."NumCad" 
         ORDER BY "IdBasin";   
        `,
      [basinId]
    );

    const data = rawSuperficial.rows;

    if (!data) {
      return [];
    }

    return data.map((superficial: any) => {
      return {
        Register: superficial.Register,
        IdBasin: superficial.IdBasin,
        Volume: superficial.Volume,
      };
    });
  }

  async getUnderGroundVolume(
    basinId: number
  ): Promise<ProducerRepositoryProtocol.VolumeByProducerOutput> {
    const rawUnderground = await censusDb.raw(
      `
            SELECT
                Cad."NumCad" AS "Register" ,
                Bacia."Id" AS "IdBasin",
                sum(SubCapMedia."VolumeMes") AS "Volume"
            FROM
                "Subterranea" Sub
                    INNER JOIN "CaptacaoMedia" AS SubCapMedia ON
                        SubCapMedia."Id" = Sub."Captacao_Id"
                    INNER JOIN "RecursoHidrico" RhSub ON
                        RhSub."Id" = Sub."Rh_Id"
                    INNER JOIN "Cadastro" AS Cad
                        ON Cad."Id"  = RhSub."Cad_Id" 
                    INNER JOIN "Municipios" SubMun ON
                        SubMun."Id" = RhSub."Municipio_Id"
                    INNER JOIN "Bacias" Bacia ON
                Bacia."Id" = SubMun."Bacia_Id"
                WHERE bacia."Id" = ?
                    GROUP BY
                        Bacia."Id",
                        SubMun."Id",
                        Cad."NumCad" 
            ORDER BY "IdBasin";
            `,
      [basinId]
    );

    const data = rawUnderground.rows;

    if (!data) {
      return [];
    }

    return data.map((superficial: any) => {
      return {
        Register: superficial.Register,
        IdBasin: superficial.IdBasin,
        Volume: superficial.Volume,
      };
    });
  }

  async getConsume(
    basinId: number
  ): Promise<ProducerRepositoryProtocol.ConsumeOutput> {
    const consumeByProducer = new Map<
      number,
      {
        IdBasin: number;
        Volumes: Array<number>;
        Consume: number;
      }
    >();

    for (const consume of [
      ...(await this.getSuperficialVolume(basinId)),
      ...(await this.getUnderGroundVolume(basinId)),
    ]) {
      if (consumeByProducer.has(consume.Register) && consume.Volume) {
        consumeByProducer.get(consume.Register)?.Volumes.push(consume.Volume);
        continue;
      }

      consumeByProducer.set(Number(consume.Register), {
        IdBasin: consume.IdBasin,
        Volumes: [consume.Volume],
        Consume: 0,
      });
    }

    consumeByProducer.forEach((producer) => {
      producer.Consume = producer.Volumes.reduce(
        (prev: number, current: number) => {
          return prev + current;
        },
        0
      );
    });

    return consumeByProducer;
  }
}
