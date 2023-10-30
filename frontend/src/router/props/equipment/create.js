import { editEquipment } from "./update";

const headerLabel = "Cadastrando equipamento";

export const createEquipment = {
  fields: editEquipment.fields,
  getDataKey: "",
  storeDataKey: "",
  submitDataKey: "create-equipment",
  headerLabel,
};
