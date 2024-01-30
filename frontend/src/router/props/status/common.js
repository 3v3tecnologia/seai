export const route = {
  fields: [
    {
      label: "Título",
      formKey: "name",
      type: "text",
    },
    {
      label: "Status",
      formKey: "status_text_formatted",
      type: "text",
      getListKey: "FETCH_STATUS_OPTIONS",
      getterKey: "statusOptions",
    },
    {
      label: "Prioridade",
      formKey: "priority",
      type: "number",
    },
    {
      label: "Minutos para reexecução (caso de falha)",
      formKey: "retrydelay",
      type: "number",
    },
    {
      label: "Tentativas de reexecução (caso de falha)",
      formKey: "retrylimit",
      type: "number",
    },
    {
      label: "Observação",
      formKey: "output",
      type: "text",
      nullable: true,
    },
  ],
};
