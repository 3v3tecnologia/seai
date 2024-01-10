import { cronsOptions, mapedCronsOptions } from "@/constants";
import { encodeBin, getUnixTime } from "@/helpers/dto";
import http from "@/http";
import { toast } from "vue3-toastify";

export default {
  state: () => ({
    list: {
      data: [],
    },
    update: {},
    cron_options: {
      data: [],
    },
  }),
  mutations: {
    ["SET_LIST"](state, list) {
      state.list = list;
    },
    ["SET_CURRENT"](state, cron) {
      state.update = cron;
    },
    ["SET_CRON_OPTIONS"](state, options) {
      state.cron_options = options;
    },
  },
  actions: {
    FETCH_CRON_OPTIONS: {
      async handler({ commit }) {
        try {
          const data = cronsOptions;

          commit("SET_CRON_OPTIONS", {
            data,
          });
        } catch (e) {
          console.error(e);
        }
      },
    },
    GET_CRONS: {
      async handler({ commit }) {
        try {
          const dataToServe = [
            {
              name: "funceme-etl",
              cron: "0 0 * * *",
              timezone: "America/Fortaleza",
              data: null,
              options: {
                tz: "America/Fortaleza",
                priority: 2,
                retryDelay: 60,
                retryLimit: 3,
              },
              created_on: "2023-12-18T18:35:38.464Z",
              updated_on: "2024-01-09T13:16:23.307Z",
            },
          ].map((c) => {
            return {
              id: c.name,
              ...c.options,
              ...c,
              cron_text_formatted: mapedCronsOptions[c.cron],
            };
          });

          commit("SET_LIST", {
            data: dataToServe,
          });
        } catch (e) {
          console.error(e);
          toast.error("Erro ao buscar crons.");
        }
      },
    },
    CREATE_CRON: {
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
    UPDATE_CRON: {
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
    GET_CURRENT_CRON: {
      async handler({ commit, dispatch, state }, id) {
        try {
          let cron = {
            name: "",
            cron: "0 0 * * *",
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
            await dispatch("GET_CRONS");
            cron = state.list.data.find((c) => c.id == id);
          }

          commit("SET_CURRENT", cron);
        } catch (e) {
          commit("SET_CURRENT", {});
          console.error(e);
          toast.error(e);
        }
      },
    },
  },
  getters: {
    cronOptions(state) {
      return state.cron_options.data.map((option) => ({
        value: option["cron"],
        title: option["title"],
      }));
    },
  },
};
