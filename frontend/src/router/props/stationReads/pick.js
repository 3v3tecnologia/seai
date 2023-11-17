const getDataKey = "GET_CURRENT_EQUIPMENT";

const submitDataKey = "UPDATE_EQUIPMENT";

const storeDataKey = "currentEquipment";

const headerLabel = "Acessar leituras do equipamento";

const fields = [
  {
    label: "Tipo de equipamento",
    formKey: "NomeTipoEquipamento",
    type: "text",
    getListKey: "FETCH_EQUIPMENT_TYPE_OPTIONS",
    getterKey: "equipmentTypeOptions",
  },
  {
    label: "Equipamento",
    formKey: "Equipamento",
    type: "text",
    getListKey: "GET_EQUIPMENTS",
    getterKey: "equipmentOptions",
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
