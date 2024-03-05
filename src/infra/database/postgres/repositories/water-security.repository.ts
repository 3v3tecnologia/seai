import { ProducerRepositoryProtocol } from "../../../../domain/use-cases/_ports/repositories/producer.repository";
import {
  WaterSecurityRepositoryDTO,
  WaterSecurityRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/water-security.repository";
import { censusDb } from "../connection/knexfile";

export class DbWaterSecurityCensusRepository
  implements WaterSecurityRepositoryProtocol
{
  async getSuperficialVolumeGroupedByProducer(
    basinId: WaterSecurityRepositoryDTO.GetSuperficialVolumeGroupedByProducer.Request
  ): WaterSecurityRepositoryDTO.GetSuperficialVolumeGroupedByProducer.Response {
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
        Register: Number(superficial.Register),
        IdBasin: superficial.IdBasin,
        Volume: Number(superficial.Volume),
      };
    });
  }

  async getUnderGroundVolumeGroupedByProducer(
    basinId: WaterSecurityRepositoryDTO.GetUnderGroundVolumeGroupedByProducer.Request
  ): WaterSecurityRepositoryDTO.GetUnderGroundVolumeGroupedByProducer.Response {
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
        Register: Number(superficial.Register),
        IdBasin: superficial.IdBasin,
        Volume: Number(superficial.Volume),
      };
    });
  }

  async getConsumeFromBasinGroupedByProducer(
    basinId: WaterSecurityRepositoryDTO.GetConsumeFromBasinGroupedByProducer.Request
  ): WaterSecurityRepositoryDTO.GetConsumeFromBasinGroupedByProducer.Response {
    const consumeByProducer = new Map<
      number,
      {
        IdBasin: number;
        Volumes: Array<number>;
        Consume: number;
      }
    >();

    // Promise all
    for (const consume of [
      ...(await this.getSuperficialVolumeGroupedByProducer(basinId)),
      ...(await this.getUnderGroundVolumeGroupedByProducer(basinId)),
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
