export interface ManagementWeight {
  Id_Bacia: number;
  Id_Cultura: number;
  SegurancaProdutivaPorQuilo: number | null;
  SegurancaProdutivaPorMetros: number | null;
  SegurancaEconomicaPorMetros: number | null;
  SegurancaEconomicaPorHectar: number | null;
  SegurancaSocialPorMetros: number | null;
  SegurancaSocialPorHectar: number | null;
  SegurancaHidricaPorHectar: number | null;
  SegurancaHidricaPorMetros: number | null;
}
