export type ManagementWeightIndicatorValue = {
  Valor: number;
  Unidade: string;
};
export interface ManagementWeights {
  Id_Bacia: number;
  Id_Cultura: number;
  Produtividade: Array<ManagementWeightIndicatorValue>;
  Rentabilidade: Array<ManagementWeightIndicatorValue>;
  Empregos: Array<ManagementWeightIndicatorValue>;
  ConsumoHidrico: Array<ManagementWeightIndicatorValue>;
}
