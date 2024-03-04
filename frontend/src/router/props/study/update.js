import { route } from "./common";

const getDataKey = "GET_CURRENT_STUDY";
const submitDataKey = "UPDATE_STUDY";
const storeDataKey = ["study", "update"];
const headerLabel = "Editando estudos";

const finishedDataButton = {
  text: "Retornar a edição de estudos",
  routeName: "study",
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
