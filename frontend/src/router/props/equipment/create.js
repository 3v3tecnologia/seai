import editEquipment from "./update";

const headerLabel = "Cadastrando equipamento";

export default {
  fields: editEquipment.fields,
  getDataKey: "",
  storeDataKey: "",
  submitDataKey: "CREATE_EQUIPMENT",
  headerLabel,
  finishedDataButton: editEquipment.finishedDataButton,
};
