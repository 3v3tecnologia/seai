const submitDataKey = "CREATE_BODY";

const headerLabel = "Criando órgão metereológico";

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

export const createBody = {
  getDataKey: "",
  storeDataKey: "",
  submitDataKey,
  headerLabel,
  fields,
};
