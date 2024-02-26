import { farmsStageDefault } from "@/constants";

export const route = {
  fields: [
    {
      formKey: "Acronyms",
      colSize: 12,
      component: {
        name: "BaseTable",
        props: {
          label: "",
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
              text: "Segurança Produtiva (kg/ha)",
              acronym: "SP1",
            },
            {
              text: "Segurança Produtiva (kg/m³)",
              acronym: "SP2",
            },
            {
              text: "Segurança Econômica (R$/ha)",
              acronym: "SE1",
            },
            {
              text: "Segurança Econômica (R$/m³)",
              acronym: "SE2",
            },
            {
              text: "Segurança Social (Empregos/ha)",
              acronym: "SS1",
            },
            {
              text: "Segurança Social (Empregos/m³)",
              acronym: "SS2",
            },
            {
              text: "Segurança Hídrica (m³/ha)",
              acronym: "SH",
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
          label: "",
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
              mutator: (value) => (value && value > 0 ? Math.floor(value) : 0),
              editorParams: {
                min: 0,
              },
            },
            {
              title: "id",
              field: "id",
              visible: false,
            },
            {
              title: "SP1",
              field: "secProd",
              editor: "number",
              mutator: (value) => (value && value > 0 ? Math.floor(value) : 0),
              editorParams: {
                min: 0,
              },
            },
            {
              title: "SP2",
              field: "secProd",
              editor: "number",
              mutator: (value) => (value && value > 0 ? Math.floor(value) : 0),
              editorParams: {
                min: 0,
              },
            },
            {
              title: "SE1",
              field: "secEconomic",
              editor: "number",
              mutator: (value) => (value && value > 0 ? Math.floor(value) : 0),
              editorParams: {
                min: 0,
              },
            },
            {
              title: "SE2",
              field: "secEconomic",
              editor: "number",
              mutator: (value) => (value && value > 0 ? Math.floor(value) : 0),
              editorParams: {
                min: 0,
              },
            },
            {
              title: "SS1",
              field: "secSocial",
              editor: "number",
              mutator: (value) => (value && value > 0 ? Math.floor(value) : 0),
              editorParams: {
                min: 0,
              },
            },
            {
              title: "SS2",
              field: "secSocial",
              editor: "number",
              mutator: (value) => (value && value > 0 ? Math.floor(value) : 0),
              editorParams: {
                min: 0,
              },
            },
            {
              title: "SH",
              field: "secHyd",
              editor: "number",
              mutator: (value) => (value && value > 0 ? Math.floor(value) : 0),
              editorParams: {
                min: 0,
              },
            },
          ],
        },
      },
    },
  ],
};
