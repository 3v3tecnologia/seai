import { defaultNewsletter } from "@/constants";
import newsletter from "./update";

const headerLabel = "Cadastrando notícia";

export default {
  fields: newsletter.fields,
  getDataKey: "",
  storeDataKey: "",
  submitDataKey: "CREATE_NEWSLETTER",
  headerLabel,
  finishedDataButton: newsletter.finishedDataButton,
  defaultValue: defaultNewsletter,
};
