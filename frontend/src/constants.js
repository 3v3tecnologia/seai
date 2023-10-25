export const usersOptions = {
  label: "Função",
  options: [
    {
      title: "Todos",
      value: null,
    },
    {
      title: "Básico",
      value: 1,
    },
    {
      title: "Admin",
      value: 2,
    },
  ],
};

export const itemsPerGraph = 20;

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
