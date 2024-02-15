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
  }),
  mutations: {
    ["SET_LIST_CULTURE"](state, list) {
      state.list = list;
    },
    ["SET_CURRENT_CULTURE"](state, culture) {
      state.update = culture;
    },
  },
  actions: {
    GET_CULTURES: {
      async handler({ commit }, filters) {
        try {
          // const {
          //   data: {
          //     data: {
          //       Data: dataRaw,
          //       QtdPages: pages,
          //       QtdRows: total,
          //       PageLimitRows: pageLimit,
          //     },
          //   },
          // } = await http.get(concatUrlFiltersList("/jobs/schedule", filters));

          const data = [
            {
              Id: 1,
              Plant_Name: "Tomate",
              Etr_Cycle_Total: 1,
              Etp_Cycle_Total: "2",
              Et0_Total: "3",
              Basin: "Banabuiú",
              Etp_Cycle_Maximium: "4",
              Location_Name: "Localização1",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
            {
              Id: 2,
              Plant_Name: "Maçã",
              Etr_Cycle_Total: 5,
              Etp_Cycle_Total: "6",
              Et0_Total: "7",
              Basin: "Médio Jaguaribe",
              Etp_Cycle_Maximium: "8",
              Location_Name: "Localização2",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
            {
              Id: 3,
              Plant_Name: "Milho de lavanda azul",
              Etr_Cycle_Total: 9,
              Etp_Cycle_Total: "10",
              Et0_Total: "11",
              Basin: "Baixo Jaguaribe",
              Etp_Cycle_Maximium: "12",
              Location_Name: "Localização3",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
            {
              Id: 4,
              Plant_Name: "Uva",
              Etr_Cycle_Total: 1,
              Etp_Cycle_Total: "14",
              Et0_Total: "15",
              Basin: "Alto Jaguaribe",
              Etp_Cycle_Maximium: "16",
              Location_Name: "Localização4",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
            {
              Id: 5,
              Plant_Name: "Cenoura",
              Etr_Cycle_Total: 1,
              Etp_Cycle_Total: "18",
              Et0_Total: "19",
              Basin: "Salgado",
              Etp_Cycle_Maximium: "20",
              Location_Name: "Localização5",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
            {
              Id: 6,
              Plant_Name: "Batata",
              Etr_Cycle_Total: 2,
              Etp_Cycle_Total: "22",
              Et0_Total: "23",
              Basin: "Alto Jaguaribe",
              Etp_Cycle_Maximium: "24",
              Location_Name: "Localização6",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
            {
              Id: 7,
              Plant_Name: "Pêssego",
              Etr_Cycle_Total: 2,
              Etp_Cycle_Total: "26",
              Et0_Total: "27",
              Basin: "Alto Jaguaribe",
              Etp_Cycle_Maximium: "28",
              Location_Name: "Localização7",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
            {
              Id: 8,
              Plant_Name: "Abóbora",
              Etr_Cycle_Total: 2,
              Etp_Cycle_Total: "30",
              Et0_Total: "31",
              Basin: "Alto Jaguaribe",
              Etp_Cycle_Maximium: "32",
              Location_Name: "Localização8",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
          ];

          // const apiPagination = {
          //   pages,
          //   total,
          //   pageLimit,
          // };

          console.log("setando dado de cultura", data);
          commit("SET_LIST_CULTURE", {
            data,
            // apiPagination,
          });
        } catch (e) {
          console.error(e);
          toast.error("Erro ao buscar culturas");
        }
      },
    },
    CREATE_CULTURE: {
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
    UPDATE_CULTURE: {
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
    GET_CURRENT_CULTURE: {
      async handler({ commit, dispatch, state }, id) {
        try {
          console.log("pegando cultura atual", id, state.list.data);
          await dispatch("GET_CULTURES");

          const culture = state.list.data.find((c) => c.id == id || c.Id == id);

          commit("SET_CURRENT_CULTURE", culture);
        } catch (e) {
          console.error("falhou ao pegar cultura atual");
          commit("SET_CURRENT_CULTURE", {});
          console.error(e);
          toast.error(e);
        } finally {
          console.log("saiu do get current culture");
        }
      },
    },
    DELETE_CULTURES: {
      async handler(_, ids) {
        try {
          // await Promise.allSettled(
          //   ids.map(
          //     async (id) => await http.delete(`/jobs/schedule?name=${id}`)
          //   )
          // );
          ids.forEach((id) => toast.success(`Cultura de id '${id}' deletado`));
        } catch (e) {
          console.error(e);
          toast.error("Falha ao deletar cultura");
          throw Error(e?.response?.data?.error);
        }
      },
    },
  },
};
