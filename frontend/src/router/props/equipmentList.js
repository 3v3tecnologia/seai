const stateOptionsFilters = [
  {
    label: "Órgão M.",
    field: "NomeOrgao",
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

const searchFilter = ["NomeEquipamento", "NomeLocalização"];

export const equipments = {
  actionText: "equipamento",
  getDataKey: "GET_EQUIPMENTS",
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
      field: "NomeEquipamento",
    },
    {
      title: "Identificador único externo",
      field: "IdExterno",
    },
    {
      title: "Órgão metereológico",
      field: "NomeOrgao",
    },
    {
      title: "Localização",
      field: "NomeLocalização",
    },
    {
      title: "Tipo",
      field: "NomeTipoEquipamento",
    },
    {
      title: "Status",
      field: "PossuiErrosDeLeituraPendentes",
      formatter: "tickCross",
    },
  ],
};
