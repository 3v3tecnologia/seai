import { farmsStageDefault } from "@/constants";

const mutatorDays = (value) => {
  if (value < 0 || !value) {
    return 1;
  }

  return Math.round(value) || 1;
};

const mutatorDivisor = (value) => {
  if (value < 0 || !value) {
    return 0;
  }

  return +Number(value).toFixed(2);
};

export const route = {
  fields: [
    {
      label: "Bacia",
      formKey: "currentBasin",
      getListKey: "FETCH_PLACES_OPTIONS",
      getterKey: "basinOptions",
      requestOnChange: true,
      props: {
        extraMarginTop: true,
      },
    },
    {
      formKey: "studys",
      colSize: 12,
      component: {
        name: "FarmDap",
        props: {
          label: "Tabela de estudos",
          hasCrudRows: false,
          columns: [
            {
              title: "Cultura",
              field: "Plant_Name",
              mutator: (a) => {
                if (a && a.length >= 50) {
                  return a.slice(50);
                } else if (a) {
                  return a;
                }

                return farmsStageDefault;
              },
            },
            {
              title: "Duração da safra (dias)",
              field: "cultureCycle",
              editor: "number",
              mutator: mutatorDays,
              editorParams: {
                min: 1,
              },
            },
            {
              title: "id",
              field: "id",
              visible: false,
            },
            {
              title: "Período de cultivo (dias)",
              field: "ProductivityPerKilo",
              editor: "number",
              mutator: mutatorDays,
              editorParams: {
                min: 1,
              },
            },
            {
              title: "Produtividade (kg/ha)",
              field: "ProductivityPerMeters",
              editor: "number",
              mutator: mutatorDivisor,
              editorParams: {
                min: 0,
                step: 0.01,
              },
            },
            {
              title: "Consumo hídrico (m³/ha)",
              field: "ProfitabilityPerHectare",
              editor: "number",
              mutator: mutatorDivisor,
              editorParams: {
                min: 0,
                step: 0.01,
              },
            },
          ],
        },
      },
    },
  ],
};
