const submitDataKey = "CREATE_BODY";
import { route } from "./common";

const headerLabel = "Criando órgão meteorológico";

const fields = [
  {
    label: "Nome",
    formKey: "Name",
    type: "text",
  },
  {
    label: "Host",
    formKey: "Host",
    type: "text",
    nullable: true,
  },
  {
    label: "Password",
    formKey: "Password",
    type: "password",
    nullable: true,
  },
];

export default {
  getDataKey: "",
  storeDataKey: "",
  submitDataKey,
  headerLabel,
  fields: route.fields,
};
