export const itemsPerGraph = 10;

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
    cron: "0 0 * * *",
    title: "Diariamente (00:00)",
  },
  {
    cron: "0 * * * *",
    title: "A cada início de hora",
  },
];

const mapedCronsOptionsTemp = {};

for (let i = 0; i < cronsOptions.length; i++) {
  const current = cronsOptions[i];
  mapedCronsOptionsTemp[current.cron] = current.title;
}

export const mapedCronsOptions = mapedCronsOptionsTemp;
