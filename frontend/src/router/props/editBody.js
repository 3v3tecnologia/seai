const getDataKey = "GET_CURRENT_BODY";

const submitDataKey = "UPDATE_BODY";

const storeDataKey = "currentBody";

const headerLabel = "Editando órgão metereológico";

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
    label: "Senha",
    formKey: "Password",
    type: "password",
    nullable: true,
  },
];

export const editBody = {
  getDataKey,
  storeDataKey,
  submitDataKey,
  headerLabel,
  fields,
};
