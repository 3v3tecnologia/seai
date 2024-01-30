const stateOptionsFilters = [
  {
    label: "Órgão M.",
    field: "Organ",
    getListKey: "FETCH_BODIES_OPTIONS",
    getterKey: "bodiesOptions",
  },
  {
    label: "Tipo de equipamento",
    field: "NomeTipoEquipamento",
    getListKey: "FETCH_EQUIPMENT_TYPE_OPTIONS",
    getterKey: "equipmentTypeOptions",
  },
];

const searchFilter = ["Name", "LocationName"];

export default {
  actionText: "equipamento",
  getDataKey: "GET_EQUIPMENTS",
  hasApiFilters: true,
  deleteDataKey: "DELETE_EQUIPMENTS",
  storeDataKey: "equipments",
  stateFilters: stateOptionsFilters,
  filters: [],
  searchFilter: searchFilter,
  actionRoutes: {
    edit: "edit-equipment",
    create: "create-equipment",
  },
  headerLabels: [
    {
      key: "totalStations",
      title: "Estações",
    },
    {
      key: "totalPluviometers",
      title: "Pluviômetros",
    },
  ],
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
      title: "Identificador único externo",
      field: "Code",
    },
    {
      title: "Órgão Meteorológico",
      field: "Organ",
    },
    {
      title: "Localização",
      field: "LocationName",
    },
    {
      title: "Tipo",
      field: "NomeTipoEquipamento",
    },
    {
      title: "Leituras",
      field: "Id",
      formatter: "link",
      formatterParams: {
        label: "Acessar leituras",
        target: "_blank",
        url: function urlFormat(col) {
          const equipRoute =
            col._cell.row.data.Type === "station" ? "station" : "pluviometer";
          return `#/${equipRoute}-reads/${col._cell.value}`;
        },
      },
    },
  ],
};
