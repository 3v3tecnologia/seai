const filters = {
  label: "Equipamento",
  field: "NomeTipoEquipamento",
  options: [
    {
      title: "Todos",
      value: null,
    },
    {
      title: "Pluviômetro",
      value: 1,
    },
    {
      title: "Estação",
      value: 2,
    },
  ],
};

const stateOptionsFilter = {
  label: "Órgão M.",
  field: "NomeOrgao",
  getListKey: "FETCH_BODIES_OPTIONS",
  getterKey: "bodiesOptions",
};

const searchFilter = ["NomeEquipamento", "NomeLocalização"];

export const equipments = {
  actionText: "equipamento",
  getDataKey: "GET_EQUIPMENTS",
  deleteDataKey: "DELETE_EQUIPMENTS",
  storeDataKey: "equipments",
  stateFilters: [stateOptionsFilter],
  filters: [filters],
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
