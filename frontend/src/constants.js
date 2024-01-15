import { mapOptions } from "./helpers/dto";

export const itemsPerGraph = 10;

export const defaultOption = {
  title: "Todos",
  key: "Todos",
  value: null,
};

export const reportsTitles = {
  registereds: "Recenseados (quantidade)",
  workers: "Trabalhadores (quantidade)",
  tanks: "Tanques (quantidade)",
  animals: "Animais (quantidade)",
  underVolTanks: "Volume de captação de tanques subterrâneos (m³)",
  underFlowTanks: "Vazão média de captação de tanques subterrâneos (m³)",
  superMonthVol: "Volume de captação mensal superficial (m³)",
  underMonthVol: "Volume de captação mensal subterrânea (m³)",
  underMonthFlow: "Vazão média de captação mensal subterrânea (m³/h)",
  superMonthFlow: "Vazão média de captação mensal superficial (m³/h)",
  secEconomic: "Segurança econômica (R$/ha)",
  secSocial: "Segurança social (Emprego/ha)",
  secHydro: "Segurança hídrica (m³/ha)",
};

export const defaultPagination = {
  itemPerPage: 5,
};

export const dataFormatUrl = {
  1: "basin",
  2: "county",
  3: "consumption",
};

export const cronsOptions = [
  {
    key: "0 0 * * *",
    value: "Diariamente (00:00)",
  },
  {
    key: "0 * * * *",
    value: "A cada início de hora",
  },
];

export const statusOptions = [
  {
    key: "created",
    value: "Criado",
  },
  {
    key: "completed",
    value: "Completado",
  },
  {
    key: "retry",
    value: "Tentando novamente",
  },
  {
    key: "active",
    value: "Em execução",
  },
  {
    key: "completed",
    value: "Completado",
  },
  {
    key: "expired",
    value: "Expirado",
  },
  {
    key: "cancelled",
    value: "Cancelado",
  },
  {
    key: "failed",
    value: "Execução falhou",
  },
];

export const mapedCronsOptions = mapOptions(cronsOptions);
export const mapedStatusOptions = mapOptions(statusOptions);
