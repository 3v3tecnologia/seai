import { IPaginationInput } from "../../../../domain/use-cases/helpers/pagination";
import { censusDb } from "../../../../infra/database/postgres/connection/knexfile";
import { CensusCultureWeights } from "../core/model/indicators-weights";
import { CultureWeightsMapper } from "../core/weights-mapper";
import { IIndicatorsWeightsRepository } from "./protocol/repository";

class IndicatorsWeightsRepository implements IIndicatorsWeightsRepository {
  async create(params: { id: number; weights: Array<CensusCultureWeights> }): Promise<void> {
    await censusDb
      .batchInsert("pesos", params.weights.map((w) => CultureWeightsMapper.toPersistence(w, params.id)))

  }

  async delete(
    mask: number
  ): Promise<void> {
    await censusDb("pesos")
      .where({
        bacia_mascara: mask,
      })
      .del();
  }

  async checkIfBasinMaskExists(bacia_mascara: number): Promise<boolean> {
    const response = await censusDb('bacia')
      .select("bacia_mascara")
      .where("bacia_mascara", bacia_mascara)
      .first()

    return response ? true : false
  }

  async getByBasin(
    ids: Array<number>
  ): Promise<Array<CensusCultureWeights> | null> {
    const basinFilter = ids.map(id => '?').join(',')

    const query = censusDb.raw(`
      with pre_calc as
          (select all_data.cadastro_id, all_data.bacia_id, all_data.cultura, areairrigada, periodocultivo, factor_area_periodo, factor_area,
                      case
                        when (areairrigada * periodocultivo) = '0' then 0.0
                          else (factor_area_periodo * volume * factor_area_periodo) / (areairrigada * periodocultivo)
                      end as volume_ajustado,
                      case
                        when (areairrigada * periodocultivo) = '0' then 0.0
                          else (factor_area_periodo * rentabilidade * factor_area_periodo) / (areairrigada)
                      end as rentabilidade_ajustado,
                      case
                        when areairrigada = '0' then 0.0
                          else (factor_area * trabalhadores * factor_area) / (areairrigada)
                      end as trabalhadores_ajustado
                  from
                    (select cult.cadastro_id, cult.bacia_id, cult.cultura, cult.municipio_id, areairrigada, periodocultivo, sum_area, sum_prod_area_periodo, 
                        volume, rentabilidade, trabalhadores,
                        case
                          when sum_prod_area_periodo = '0' then 0
                            else (areairrigada * periodocultivo)/sum_prod_area_periodo
                        end as factor_area_periodo,
                        case
                          when sum_area = '0' then 0
                            else areairrigada/sum_area
                        end as factor_area
                    from
                      (select c.cadastro_id, cultura, areairrigada, periodocultivo, bacia_id, municipio_id from culturas c
                      inner join recursohidrico r
                      on r.cadastro_id = c.cadastro_id
                      inner join municipios m 
                      on m.id = r.municipio_id
                      /*Filtrar por determinadas bacias ou municípios
                      * Selecionar a bacia a seguir (uma ou mais):
                      * 	1 - Alto Jaguaribe
                      *  2 - Médio Jaguaribe
                      *  3 - Baixo Jaguaribe
                      *  4 - Banabuiú
                      *  5 - Salgado
                      */
                      -- where municipio_id in ('1', '2', '16', '64')) cult
                      where bacia_id in (${basinFilter})) cult
                    inner join
                      (select cadastro_id, avg(periodocultivo) periodo_cultivo_medio, sum(areairrigada) sum_area, sum(areairrigada * periodocultivo) sum_prod_area_periodo from culturas 
                      group by cadastro_id) compiled_cult
                    on cult.cadastro_id = compiled_cult.cadastro_id
                    inner join
                      (select cadastro_id, sum(volumemes) volume from
                      ((select s.cadastro_id, captacao_id, mes, volumemes from subterranea s
                      inner join captacaomedia c
                      on s.captacao_id = c.id)
                      union
                      (select s.cadastro_id, captacao_id, mes, volumemes from superficial s
                      inner join captacaomedia c
                      on s.captacao_id = c.id))
                      group by cadastro_id) volumes
                    on cult.cadastro_id = volumes.cadastro_id
                    inner join 
                    irrigacao i 
                    on volumes.cadastro_id = i.cadastro_id
                    inner join 
                      (select cadastro_id, 
                      sum(
                        case 
                          when trabalhadores is null then 0
                        else trabalhadores
                        end) trabalhadores from
                      ((select pf.cadastro_id, numtrabalhadores trabalhadores from pessoafisica pf)
                      union
                      (select pj.cadastro_id, numtrabalhadores trabalhadores from pessoajuridica pj)) as all_jobs
                      group by cadastro_id) empregos
                    on volumes.cadastro_id = empregos.cadastro_id) all_data
                  ),
          indicadores as
          (select    cultura,
                "year",
                sum(recenseados) recenseados,
                sum(recenseados * indicador_produtividade_ha) / sum(recenseados) produtividade_ha,
                sum(recenseados * indicador_rentabilidade_ha) / sum(recenseados) rentabilidade_ha,
                sum(recenseados * indicador_emprego_ha) / sum(recenseados) empregos_ha,
                sum(recenseados * indicador_volume_ha) / sum(recenseados) consumo_hidrico_ha,
                sum(recenseados * indicador_produtividade_ha) / sum(recenseados) / (sum(recenseados * indicador_volume_ha) / sum(recenseados)) produtividade_m3,
                sum(recenseados * indicador_rentabilidade_ha) / sum(recenseados) / (sum(recenseados * indicador_volume_ha) / sum(recenseados)) rentabilidade_m3,
                1000 * sum(recenseados * indicador_emprego_ha) / sum(recenseados) / (sum(recenseados * indicador_volume_ha) / sum(recenseados)) empregos_1000m3,
                sum(recenseados * periodocultivo_medio) / sum(recenseados) safra_m3
            from
                (select indicadores.cultura,
                  indicadores.bacia_id,
                  estudos_calc."year",
                  areairrigada_total areairrigada_total,
                  indicadores.quantidade_total recenseados,
                  periodocultivo_medio,
                  indicador_volume * estudos_calc.safra_meses indicador_volume_ha,
                  indicador_rentabilidade * estudos_calc.safra_meses indicador_rentabilidade_ha,
                  indicador_emprego indicador_emprego_ha,
                  estudos_calc.kg_m3_factor * indicador_volume * estudos_calc.safra_meses indicador_produtividade_ha
              from
                (select pre_calc.cultura,
                    pre_calc.bacia_id,
                    count(*) quantidade_total,
                    sum(pre_calc.areairrigada) areairrigada_total,
                    avg(pre_calc.periodocultivo) periodocultivo_medio,
                    sum(
                    case 
                        when pre_calc.volume_ajustado > 0 then pre_calc.volume_ajustado
                        else null
                    end) / 
                    sum(
                    case 
                        when pre_calc.volume_ajustado > 0 then pre_calc.factor_area_periodo
                        else null
                    end) indicador_volume,
                    sum(  
                    case 
                        when pre_calc.rentabilidade_ajustado > 0 then pre_calc.rentabilidade_ajustado
                        else null
                    end) / 
                    sum(
                    case 
                        when pre_calc.rentabilidade_ajustado > 0 then factor_area_periodo
                        else null
                    end) indicador_rentabilidade,
                    sum(
                    case 
                        when pre_calc.trabalhadores_ajustado > 0 then pre_calc.trabalhadores_ajustado
                        else null
                    end) / 
                    sum(
                    case 
                        when pre_calc.trabalhadores_ajustado > 0 then pre_calc.factor_area
                        else null
                    end) indicador_emprego
                from
                  pre_calc
                group by pre_calc.cultura, pre_calc.bacia_id) indicadores
            inner join 
              (select cultura, bacia_id, safra_meses, cultivo_dias, produtividade/consumohidrico kg_m3_factor, "year" from estudos
              where "year" = 2023) estudos_calc
            on indicadores.cultura = estudos_calc.cultura and indicadores.bacia_id = estudos_calc.bacia_id)
            group by cultura, "year"
            /*Remover determinados resultados do cálculo de peso, exemplo, número mínimo de recenseados, ou determinadas culturas*/
            -- having 2 > 1
            -- having cultura not in ('SIRIGUELA')
            )
          select cultura,
              bacia_mascara,
              "year" as ano,
              case 
                when produtividade_ha/max_produtividade_ha = 1 then 1
                when produtividade_ha/max_produtividade_ha > 0.7 then 0.75
                else 0.5
              end peso_produtividade_ha,
              case 
                when produtividade_m3/max_produtividade_m3 = 1 then 1
                when produtividade_m3/max_produtividade_m3 > 0.7 then 0.75
                else 0.5
              end peso_produtividade_m3,
              case 
                when rentabilidade_ha/max_rentabilidade_ha = 1 then 1
                when rentabilidade_ha/max_rentabilidade_ha > 0.7 then 0.75
                else 0.5
              end peso_rentabilidade_ha,
              case 
                when rentabilidade_m3/max_rentabilidade_m3 = 1 then 1
                when rentabilidade_m3/max_rentabilidade_m3 > 0.7 then 0.75
                else 0.5
              end peso_rentabilidade_m3,
              case 
                when empregos_ha/max_empregos_ha = 1 then 1
                when empregos_ha/max_empregos_ha > 0.7 then 0.75
                else 0.5
              end peso_empregos_ha,
              case 
                when empregos_1000m3/max_empregos_1000m3 = 1 then 1
                when empregos_1000m3/max_empregos_1000m3 > 0.7 then 0.75
                else 0.5
              end peso_empregos_m3,
              case 
                when consumo_hidrico_ha/min_consumo_hidrico_ha >= 1.3 then 0.5
                when consumo_hidrico_ha/min_consumo_hidrico_ha > 1 then 0.75
                else 1
              end peso_produtividade_ha,
              case 
                when produtividade_ha/max_produtividade_ha = 1 then 1
                when produtividade_ha/max_produtividade_ha > 0.7 then 0.75
                else 0.5
              end peso_produtividade_ha
          from 
          (select 
              max(produtividade_ha) max_produtividade_ha, 
              max(produtividade_m3) max_produtividade_m3,
              max(rentabilidade_ha) max_rentabilidade_ha,
              max(rentabilidade_m3) max_rentabilidade_m3,
              max(empregos_ha) max_empregos_ha,
              max(empregos_1000m3) max_empregos_1000m3,
              min(consumo_hidrico_ha) min_consumo_hidrico_ha,
              max(safra_m3) max_safra_m3
          from indicadores) max_values
          cross join
          indicadores
          cross join
          (select sum(distinct 2^(bacia_id-1)) bacia_mascara from pre_calc)
    `, ids)


    const result = await query;

    if (!result.length) {
      return null;
    }

    const weights = result.map((row: any) =>
      CultureWeightsMapper.toDomain(row)
    );

    return weights;
  }
}

export const makeIndicatorsWeightsRepository = () => new IndicatorsWeightsRepository()