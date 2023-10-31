const getDataKey = "GET_CURRENT_EQUIPMENT";

const submitDataKey = "UPDATE_EQUIPMENT";

const storeDataKey = "currentEquipment";

const headerLabel = "Editando equipamento";

const fields = [
  {
    label: "Nome",
    formKey: "NomeEquipamento",
    type: "text",
  },
  {
    label: "Id externo",
    formKey: "IdExterno",
    type: "text",
  },
  {
    label: "Nome do órgão",
    formKey: "NomeOrgao",
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
    formKey: "NomeLocalização",
    type: "text",
  },
  {
    label: "Latitude",
    formKey: "x",
    type: "text",
  },
  {
    label: "Longitude",
    formKey: "y",
    type: "text",
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
};
