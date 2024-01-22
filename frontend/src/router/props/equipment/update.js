import { route } from "./common";

const getDataKey = "GET_CURRENT_EQUIPMENT";
const submitDataKey = "UPDATE_EQUIPMENT";
const storeDataKey = "currentEquipment";
const headerLabel = "Editando equipamento";

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
  fields: route.fields,
  navBarTab: route.navBarTab,
};
