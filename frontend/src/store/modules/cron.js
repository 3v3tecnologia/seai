import { cronsOptions, defaultOption, mapedCronsOptions } from "@/constants";
import { concatUrlFiltersList } from "@/helpers/dto";
import http from "@/http";
import { toast } from "vue3-toastify";

export default {
  state: () => ({
    list: {
      data: [],
      apiPagination: {
        pages: 1,
        total: 0,
      },
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
      async handler({ commit }, filters) {
        try {
          const {
            data: {
              data: {
                Data: dataRaw,
                QtdPages: pages,
                QtdRows: total,
                PageLimitRows: pageLimit,
              },
            },
          } = await http.get(concatUrlFiltersList("/jobs/schedule", filters));

          const data = dataRaw.map((c) => {
            return {
              id: c.name,
              ...c.options,
              ...c,
              cron_text_formatted: mapedCronsOptions[c.cron],
            };
          });

          const apiPagination = {
            pages,
            total,
            pageLimit,
          };

          commit("SET_LIST", {
            data,
            apiPagination,
          });
        } catch (e) {
          console.error(e);
          toast.error("Erro ao buscar crons");
        }
      },
    },
    CREATE_CRON: {
      async handler(_, form) {
        try {
          const {
            name,
            cron_text_formatted,
            priority,
            retryLimit,
            retryDelay,
          } = form;

          const data = {
            name,
            cron: cron_text_formatted.value,
            data: null,
            options: {
              priority,
              retryLimit,
              retryDelay,
            },
          };

          await http.post(`/jobs/schedule`, data);
          toast.success("Rotina criada com sucesso");
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
          const {
            name,
            cron_text_formatted,
            priority,
            retryLimit,
            retryDelay,
          } = form;

          const data = {
            name,
            cron: cron_text_formatted.value,
            data: null,
            options: {
              priority,
              retryLimit,
              retryDelay,
            },
          };

          await http.put(`/jobs/schedule/`, data);
          toast.success("Rotina atualizada com sucesso");
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
          await dispatch("GET_CRONS");
          const cron = state.list.data.find((c) => c.id == id);

          commit("SET_CURRENT", cron);
        } catch (e) {
          commit("SET_CURRENT", {});
          console.error(e);
          toast.error(e);
        }
      },
    },
    DELETE_CRONS: {
      async handler(_, ids) {
        try {
          await Promise.allSettled(
            ids.map(
              async (id) => await http.delete(`/jobs/schedule?name=${id}`)
            )
          );
          toast.success("Sucesso ao deletar rotinas(s)");
        } catch (e) {
          console.error(e);
          toast.success("Falha ao deletar rotinas(s)");
          throw Error(e?.response?.data?.error);
        }
      },
    },
  },
  getters: {
    cronOptions(state) {
      const optsData = state.cron_options.data.map((option) => ({
        value: option["key"],
        title: option["value"],
      }));

      return [defaultOption, ...optsData];
    },
  },
};
