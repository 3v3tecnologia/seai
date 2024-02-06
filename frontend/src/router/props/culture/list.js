const searchFilter = ["name"];

const stateOptionsFilters = [
  {
    label: "Recorrência",
    field: "cron_text_formatted",
    getListKey: "FETCH_CRON_OPTIONS",
    getterKey: "cronOptions",
  },
];

export default {
  actionText: "rotina",
  getDataKey: "GET_CRONS",
  hasApiFilters: true,
  deleteDataKey: "DELETE_CRONS",
  storeDataKey: ["cron", "list"],
  filters: [],
  titleKey: "Plant_Name",
  searchFilter: searchFilter,
  stateFilters: stateOptionsFilters,
  actionRoutes: {
    edit: "edit-cron",
    create: "create-cron",
  },
  headerLabels: [],
  chips: [{ key: "Basin" }],
  fields: [
    { label: "Total de ciclos ETR", key: "Etr_Cycle_Total" },
    { label: "Total de ciclos ETP", key: "Etp_Cycle_Total" },
    { label: "Total ET0 do ciclo", key: "Et0_Total" },
    { label: "ETP máximo do ciclo", key: "Etp_Cycle_Maximium" },
  ],
};
