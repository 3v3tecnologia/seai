export type ManagementStudyIndicator = {
  Value: number | null;
  Unidade: string;
};

export interface ManagementCensusStudy {
  // Id_Bacia: number;
  Id_Cultura: number;
  Safra: number;
  Cultivo: number;
  Produtividade: Array<ManagementStudyIndicator>;
}
