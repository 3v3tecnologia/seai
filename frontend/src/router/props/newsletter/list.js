const stateOptionsFilters = [];

const searchFilter = ["Name", "LocationName"];

export default {
  actionText: "notícia",
  navBarTab: 6,
  getDataKey: "GET_NEWSLETTERS",
  hasApiFilters: true,
  deleteDataKey: "DELETE_NEWSLETTER",
  storeDataKey: ["newsletter", "list"],
  filters: [],
  searchFilter: searchFilter,
  actionRoutes: {
    edit: "edit-newsletter",
    create: "create-newsletter",
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
      title: "Título",
      field: "Title",
    },
    {
      title: "Data de envio",
      field: "Time",
    },
    {
      title: "Hora",
      field: "Hour",
    },
    {
      title: "Autor",
      field: "Auth",
    },
    {
      title: "Localização de envio",
      field: "LocationName",
    },
  ],
};
