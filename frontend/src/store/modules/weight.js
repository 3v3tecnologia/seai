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
    ["SET_LIST_WEIGHT"](state, list) {
      state.list = list;
    },
    ["SET_CURRENT_WEIGHT"](state, culture) {
      state.update = culture;
    },
  },
  actions: {
    GET_WEIGHTS: {
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
              cultureCycle: 1,
              Plant_Name: "Tomate",
              ProductivityPerKilo: 1,
              ProductivityPerMeters: 1,
              ProfitabilityPerMeters: "2",
              ProfitabilityPerHectare: "2",
              JobsPerHectare: "3",
              JobsPerMeters: "3",
              Basin: "Banabuiú",
              WaterConsumptionPerMeters: "4",
              Location_Name: "Localização1",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
            {
              Id: 2,
              cultureCycle: 2,
              Plant_Name: "Maçã",
              ProductivityPerKilo: 5,
              ProductivityPerMeters: 5,
              ProfitabilityPerMeters: "6",
              ProfitabilityPerHectare: "6",
              JobsPerHectare: "7",
              JobsPerMeters: "7",
              Basin: "Médio Jaguaribe",
              WaterConsumptionPerMeters: "8",
              Location_Name: "Localização2",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
            {
              Id: 3,
              cultureCycle: 3,
              Plant_Name: "Milho de lavanda azul",
              ProductivityPerKilo: 9,
              ProductivityPerMeters: 9,
              ProfitabilityPerMeters: "10",
              ProfitabilityPerHectare: "10",
              JobsPerHectare: "11",
              JobsPerMeters: "11",
              Basin: "Baixo Jaguaribe",
              WaterConsumptionPerMeters: "12",
              Location_Name: "Localização3",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
            {
              Id: 4,
              cultureCycle: 4,
              Plant_Name: "Uva",
              ProductivityPerKilo: 1,
              ProductivityPerMeters: 1,
              ProfitabilityPerMeters: "14",
              ProfitabilityPerHectare: "14",
              JobsPerHectare: "15",
              JobsPerMeters: "15",
              Basin: "Alto Jaguaribe",
              WaterConsumptionPerMeters: "16",
              Location_Name: "Localização4",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
            {
              Id: 5,
              cultureCycle: 5,
              Plant_Name: "Cenoura",
              ProductivityPerKilo: 1,
              ProductivityPerMeters: 1,
              ProfitabilityPerMeters: "18",
              ProfitabilityPerHectare: "18",
              JobsPerHectare: "19",
              JobsPerMeters: "19",
              Basin: "Salgado",
              WaterConsumptionPerMeters: "20",
              Location_Name: "Localização5",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
            {
              Id: 6,
              cultureCycle: 6,
              Plant_Name: "Batata",
              ProductivityPerKilo: 2,
              ProductivityPerMeters: 2,
              ProfitabilityPerMeters: "22",
              ProfitabilityPerHectare: "22",
              JobsPerHectare: "23",
              JobsPerMeters: "23",
              Basin: "Alto Jaguaribe",
              WaterConsumptionPerMeters: "24",
              Location_Name: "Localização6",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
            {
              Id: 7,
              cultureCycle: 7,
              Plant_Name: "Pêssego",
              ProductivityPerKilo: 2,
              ProductivityPerMeters: 2,
              ProfitabilityPerMeters: "26",
              ProfitabilityPerHectare: "26",
              JobsPerHectare: "27",
              JobsPerMeters: "27",
              Basin: "Alto Jaguaribe",
              WaterConsumptionPerMeters: "28",
              Location_Name: "Localização7",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
            {
              Id: 8,
              cultureCycle: 8,
              Plant_Name: "Abóbora",
              ProductivityPerKilo: 2,
              ProductivityPerMeters: 2,
              ProfitabilityPerMeters: "30",
              ProfitabilityPerHectare: "30",
              JobsPerHectare: "31",
              JobsPerMeters: "31",
              Basin: "Alto Jaguaribe",
              WaterConsumptionPerMeters: "32",
              Location_Name: "Localização8",
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
            },
          ].map((c, i) => {
            c.CropCycle = [
              {
                Stage_Title: "Pré plantio",
                Duration_In_Days: 5,
                KC: 0.5,
              },
              {
                Stage_Title: "Plantio",
                Duration_In_Days: 5,
                KC: 1,
              },
              {
                Stage_Title: "Amadurecimento",
                Duration_In_Days: 12,
                KC: 1.2,
              },
              {
                Stage_Title: "Pré colheita 1 ",
                Duration_In_Days: 3,
                KC: 0.8,
              },
              {
                Stage_Title: "Pré colheita 2",
                Duration_In_Days: 2,
                KC: 0.8,
              },
              {
                Stage_Title: "Pré colheita 3",
                Duration_In_Days: 2,
                KC: 0.8,
              },
              {
                Stage_Title: "Pré colheita 4",
                Duration_In_Days: 2,
                KC: 0.8,
              },
            ].map((s, j) => {
              s.id = j + 1;
              s.Duration_In_Days += i;
              s.KC += i;

              return s;
            });

            return c;
          });

          // const apiPagination = {
          //   pages,
          //   total,
          //   pageLimit,
          // };

          commit("SET_LIST_WEIGHT", {
            data,
            // apiPagination,
          });
        } catch (e) {
          console.error(e);
          toast.error("Erro ao buscar culturas");
        }
      },
    },
    UPDATE_WEIGHT: {
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
          toast.success("Pesos atualizados com sucesso");
        } catch (e) {
          console.error(e);
          toast.error("Falha ao atualizar rotina");
          throw Error(e?.response?.data?.error);
        }
      },
    },
    GET_CURRENT_WEIGHT: {
      async handler({ commit, dispatch, state }, id) {
        try {
          console.log("pedindo current weight", id);
          await dispatch("GET_WEIGHTS");

          const culture = state.list.data;

          commit("SET_CURRENT_WEIGHT", { Weights: culture });
        } catch (e) {
          console.error("Falhou ao pegar dados de peso");
          commit("SET_CURRENT_WEIGHT", {});
          console.error(e);
          toast.error(e);
        }
      },
    },
  },
};
