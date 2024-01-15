import { statusOptions, mapedStatusOptions, defaultOption } from "@/constants";
import { encodeBin, getUnixTime } from "@/helpers/dto";
import http from "@/http";
import { toast } from "vue3-toastify";

export default {
  state: () => ({
    list: {
      data: [],
    },
    update: {},
    status_options: {
      data: [],
    },
  }),
  mutations: {
    ["SET_LIST"](state, list) {
      state.list = list;
    },
    ["SET_CURRENT"](state, status) {
      state.update = status;
    },
    ["SET_STATUS_OPTIONS"](state, options) {
      state.status_options = options;
    },
  },
  actions: {
    FETCH_STATUS_OPTIONS: {
      async handler({ commit }) {
        try {
          const data = statusOptions;

          commit("SET_STATUS_OPTIONS", {
            data,
          });
        } catch (e) {
          console.error(e);
        }
      },
    },
    GET_STATUS: {
      async handler({ commit }) {
        try {
          const dataToServe = [
            {
              id: "96a9c298-4662-4972-a4ed-1399c5387ed1",
              name: "send-newsletter",
              priority: 1,
              data: {
                id: 2,
              },
              state: "completed",
              retrylimit: 23,
              retrycount: 0,
              retrydelay: 40,
              retrybackoff: false,
              startafter: "2024-01-11T12:21:27.005Z",
              startedon: "2024-01-11T12:21:31.127Z",
              expirein: {
                minutes: 15,
              },
              createdon: "2024-01-11T12:21:27.005Z",
              completedon: "2024-01-11T12:21:33.751Z",
              keepuntil: "2024-01-25T12:21:27.005Z",
              on_complete: false,
              output: null,
            },
          ].map((c) => {
            return {
              id: c.name,
              ...c.options,
              ...c,
              status_text_formatted: mapedStatusOptions[c.state],
            };
          });

          commit("SET_LIST", {
            data: dataToServe,
          });
        } catch (e) {
          console.error(e);
          toast.error("Erro ao buscar status.");
        }
      },
    },
    CREATE_STATUS: {
      async handler(_, form) {
        try {
          const newsletter = {
            FK_Author: 1,
            Title: form.Title,
            Description: form.Description,
            Data: encodeBin(form.Text),
            SendDate: getUnixTime(form.Time),
          };

          await http.post(`/news/`, newsletter);
          toast.success("Rotina criada com sucesso.");
        } catch (e) {
          console.error(e);
          toast.error("Falha ao criar rotina");
          throw Error(e?.response?.data?.error);
        }
      },
    },
    UPDATE_STATUS: {
      async handler(_, form) {
        try {
          const newsletter = {
            FK_Author: 1,
            Title: form.Title,
            Description: form.Description,
            Data: encodeBin(form.Text),
            SendDate: getUnixTime(form.Time),
          };

          await http.put(`/news/${form.Id}`, newsletter);
          toast.success("Rotina atualizada com sucesso.");
        } catch (e) {
          console.error(e);
          toast.error("Falha ao atualizar rotina");
          throw Error(e?.response?.data?.error);
        }
      },
    },
    GET_CURRENT_STATUS: {
      async handler({ commit, dispatch, state }, id) {
        try {
          let status = {
            name: "",
            status: "0 0 * * *",
            timezone: "America/Fortaleza",
            data: null,
            tz: "America/Fortaleza",
            priority: 2,
            retryDelay: 60,
            retryLimit: 3,
            created_on: "",
            updated_on: "",
          };

          if (id) {
            await dispatch("GET_STATUS");
            status = state.list.data.find((c) => c.id == id);
          }

          commit("SET_CURRENT", status);
        } catch (e) {
          commit("SET_CURRENT", {});
          console.error(e);
          toast.error(e);
        }
      },
    },
  },
  getters: {
    statusOptions(state) {
      const optsData = state.status_options.data.map((option) => ({
        value: option["key"],
        title: option["value"],
      }));

      return [defaultOption, ...optsData];
    },
  },
};
