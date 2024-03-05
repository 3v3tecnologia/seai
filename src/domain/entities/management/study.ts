export type ManagementStudyIndicator = {
  Value: number | null;
  Unity: string;
};

export interface ManagementCensusStudy {
  Id_Basin: number;
  Culture: number;
  Harvest: number;
  Farm: number;
  Productivity: Array<ManagementStudyIndicator>;
}
