import { route } from "./common";

const getDataKey = "GET_CURRENT_WEIGHT";
const submitDataKey = "UPDATE_WEIGHT";
const storeDataKey = ["weight", "update"];
const headerLabel = "Editando pesos";

const finishedDataButton = {
  text: "Retornar a edição de pesos",
  routeName: "weight",
};

export default {
  getDataKey,
  storeDataKey,
  submitDataKey,
  finishedDataButton,
  headerLabel,
  fields: route.fields,
  workWithoutId: true,
};
