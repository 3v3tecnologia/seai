const getDataKey = "GET_CURRENT_EQUIPMENT";

const submitDataKey = "UPDATE_EQUIPMENT";

const storeDataKey = "currentEquipment";

const headerLabel = "Editando equipamento";

const fields = [
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
];

const finishedDataButton = {
  text: "Retornar a listagem de equipamentos",
  routeName: "equipments",
};

export default {
  getDataKey,
  storeDataKey,
  submitDataKey,
  finishedDataButton,
  headerLabel,
  fields,
  navBarTab: 2,
};
