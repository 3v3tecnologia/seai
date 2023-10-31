const getDataKey = "GET_EQUIPMENTS";

const submitDataKey = "UPDATE_EQUIPMENT";

const storeDataKey = "currentEquipment";

const headerLabel = "Visualizar leituras de equipamento";

const fields = [
  {
    label: "Escolha um equipamento",
    formKey: "equipment",
    type: "text",
    getListKey: "GET_EQUIPMENTS",
    getterKey: "equipmentOptions",
  },
];

const finishedDataButton = {
  text: "Buscar dados",
  routeName: "equipments-reads",
  fieldIdIndex: 0,
  isRedirect: true,
};

export default {
  getDataKey,
  storeDataKey,
  submitDataKey,
  finishedDataButton,
  headerLabel,
  fields,
};
