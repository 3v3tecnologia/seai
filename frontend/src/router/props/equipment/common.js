export const route = {
  navBarTab: 2,

  fields: [
    {
      label: "Nome",
      formKey: "Name",
      type: "text",
    },
    {
      label: "Id externo",
      formKey: "Code",
      type: "text",
    },
    {
      label: "Nome do órgão",
      formKey: "Organ",
      type: "text",
      getListKey: "FETCH_BODIES_OPTIONS",
      getterKey: "bodiesOptions",
    },
    {
      label: "Tipo de equipamento",
      formKey: "NomeTipoEquipamento",
      type: "text",
      getListKey: "FETCH_EQUIPMENT_TYPE_OPTIONS",
      getterKey: "equipmentTypeOptions",
    },
    {
      label: "Nome da localização",
      formKey: "LocationName",
      type: "text",
    },
    {
      label: "Altitude",
      formKey: "Altitude",
      type: "number",
    },
    {
      label: "Latitude",
      formKey: "x",
      type: "number",
    },
    {
      label: "Longitude",
      formKey: "y",
      type: "number",
    },
  ],
};
