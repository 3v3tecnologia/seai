export const route = {
  navBarTab: 1,

  fields: [
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
  ],
};
