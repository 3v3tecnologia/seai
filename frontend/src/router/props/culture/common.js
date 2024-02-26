import { farmsStageDefault } from "@/constants";

export const route = {
  fields: [
    { label: "Total de ciclos ETR", formKey: "Etr_Cycle_Total" },
    { label: "Total de ciclos ETP", formKey: "Etp_Cycle_Total" },
    { label: "Total ET0 do ciclo", formKey: "Et0_Total" },
    { label: "ETP máximo do ciclo", formKey: "Etp_Cycle_Maximium" },
    {
      formKey: "CropCycle",
      colSize: 12,
      component: {
        name: "FarmDap",
        props: {
          label: "Tabela de cultura",
          columns: [
            {
              formatter: "rowSelection",
              titleFormatter: "",
              align: "center",
              headerSort: false,
              width: 80,
            },
            {
              title: "Estágio",
              field: "Stage_Title",
              editor: "input",
              mutator: (a, b, c, d, e) => {
                if (a && a.length >= 50) {
                  return a.slice(50);
                } else if (a) {
                  return a;
                }
                return farmsStageDefault;
              },
            },
            {
              title: "id",
              field: "id",
              visible: false,
            },
            {
              title: "Duração (dias)",
              field: "Duration_In_Days",
              editor: "number",
              mutator: (value) => (value && value > 0 ? Math.floor(value) : 1),
              editorParams: {
                min: 1,
              },
            },
            {
              title: "KC",
              field: "KC",
              editor: "number",
              editorParams: {
                min: 0.1,
                step: 0.1,
              },
              mutator: (value) => (value > 0 ? value : 0),
            },
          ],
        },
      },
    },
  ],
};
