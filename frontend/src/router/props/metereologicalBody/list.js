const searchFilter = ["Name"];

export default {
  actionText: "Órg. Metereológico",
  getDataKey: "FETCH_BODIES_OPTIONS",
  deleteDataKey: "DELETE_BODIES",
  storeDataKey: "metereologicalBodies",
  navBarTab: 1,
  stateFilters: [],
  filters: [],
  searchFilter: searchFilter,
  actionRoutes: {
    edit: "edit-body",
    create: "create-body",
  },
  headerLabels: [],
  columns: [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      align: "center",
      headerSort: false,
      width: 80,
    },
    {
      title: "Nome",
      field: "Name",
    },
    {
      title: "Host",
      field: "Host",
    },
    {
      title: "Usuário",
      field: "User",
    },
  ],
};
