export const route = {
  finishedDataButton: {
    text: "Retornar a listagem de rotinas",
    routeName: "cron",
  },

  fields: [
    {
      label: "Título",
      formKey: "name",
      type: "text",
    },
    {
      label: "Recorrência",
      formKey: "cron_text_formatted",
      type: "text",
      getListKey: "FETCH_CRON_OPTIONS",
      getterKey: "cronOptions",
    },
    {
      label: "Prioridade",
      formKey: "priority",
      type: "number",
    },
    {
      label: "Minutos para reexecução (caso de falha)",
      formKey: "retryDelay",
      type: "number",
    },
    {
      label: "Tentativas de reexecução (caso de falha)",
      formKey: "retryLimit",
      type: "number",
    },
  ],
};
