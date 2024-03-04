import { farmsStageDefault } from "@/constants";

const mutatorWeights = (value) => {
  if (value < 0 || !value) {
    return 0;
  } else if (value >= 1) {
    return 1;
  }

  return +value.toFixed(2);
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
      formKey: "Acronyms",
      colSize: 12,
      component: {
        name: "BaseTable",
        props: {
          label: "Tabela de associações",
          addMarginTop: true,
          selectable: false,
          apiPagination: {},
          hidePagination: true,
          columns: [
            {
              title: "Sigla",
              field: "acronym",
            },
            {
              title: "Cabeçalho",
              field: "text",
            },
          ],
          data: [
            {
              text: "Ciclo da Cultura",
              acronym: "CC",
            },
            {
              text: "Segurança Produtiva",
              acronym: "SP",
            },
            {
              text: "Segurança Econômica",
              acronym: "SE",
            },
            {
              text: "Segurança Hídrica",
              acronym: "SH",
            },
            {
              text: "Segurança Social",
              acronym: "SS",
            },
          ],
        },
      },
    },
    {
      formKey: "Weights",
      colSize: 12,
      component: {
        name: "FarmDap",
        props: {
          label: "Tabela de pesos",
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
              title: "CC",
              field: "cultureCycle",
              editor: "number",
              width: 60,
              mutator: mutatorWeights,
              editorParams: {
                min: 0,
                max: 1,
                step: 0.01,
              },
            },
            {
              title: "id",
              field: "id",
              visible: false,
            },
            {
              title: "SP (kg/ha)",
              field: "ProductivityPerKilo",
              editor: "number",
              width: 70,
              mutator: mutatorWeights,
              editorParams: {
                min: 0,
                max: 1,
                step: 0.01,
              },
            },
            {
              title: "SP (kg/m³)",
              field: "ProductivityPerMeters",
              editor: "number",
              width: 70,
              mutator: mutatorWeights,
              editorParams: {
                min: 0,
                max: 1,
                step: 0.01,
              },
            },
            {
              title: "SE (R$/ha)",
              field: "ProfitabilityPerHectare",
              editor: "number",
              width: 70,
              mutator: mutatorWeights,
              editorParams: {
                min: 0,
                max: 1,
                step: 0.01,
              },
            },
            {
              title: "SE (R$/m³)",
              field: "ProfitabilityPerMeters",
              editor: "number",
              width: 70,
              mutator: mutatorWeights,
              editorParams: {
                min: 0,
                max: 1,
                step: 0.01,
              },
            },
            {
              title: "SH (m³/ha)",
              field: "WaterConsumptionPerHectare",
              editor: "number",
              width: 70,
              mutator: mutatorWeights,
              editorParams: {
                min: 0,
                max: 1,
                step: 0.01,
              },
            },
            {
              title: "SS (Empregos/ha)",
              field: "JobsPerHectare",
              editor: "number",
              minWidth: 120,
              mutator: mutatorWeights,
              editorParams: {
                min: 0,
                max: 1,
                step: 0.01,
              },
            },
            {
              title: "SS (Empregos/m³)",
              field: "JobsPerMeters",
              editor: "number",
              minWidth: 120,
              mutator: mutatorWeights,
              editorParams: {
                min: 0,
                max: 1,
                step: 0.01,
              },
            },
            {
              title: "Corte Hídrico",
              field: "hydBlade",
              width: 70,
              formatter: (col) => {
                const {
                  ProductivityPerKilo,
                  ProductivityPerMeters,
                  ProfitabilityPerMeters,
                  ProfitabilityPerHectare,
                  JobsPerHectare,
                  JobsPerMeters,
                  WaterConsumptionPerHectare,
                  cultureCycle,
                } = col._cell.row.data;

                const values = [
                  ProductivityPerKilo,
                  ProductivityPerMeters,
                  ProfitabilityPerMeters,
                  ProfitabilityPerHectare,
                  JobsPerHectare,
                  JobsPerMeters,
                  WaterConsumptionPerHectare,
                  cultureCycle,
                ].map((c) => (c ? Number(c) : 0));

                const avgValue = values.reduce((a, b) => a + b, 0) / 8;

                return Number(((avgValue - 1) * 100).toFixed(2));
              },
            },
          ],
        },
      },
    },
  ],
};
