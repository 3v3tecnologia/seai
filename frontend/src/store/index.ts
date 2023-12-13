import "vue3-toastify/dist/index.css";
import newsletter from "./modules/newsletter";
import { createStore, Store, useStore as vuexUseStore } from "vuex";
import { toast } from "vue3-toastify";
import { InjectionKey } from "vue";

import IAuth from "@/interfaces/IAuth";
import IUser from "@/interfaces/IUser";
import IUsersWrapper from "@/interfaces/IUsersWrapper";
import ICityOption from "@/interfaces/ICityOption";
import IHydrographicBasinOption from "@/interfaces/IHydrographicBasinOption";

import { previewEmailCensured } from "@/helpers/formatEmail";
import INewUser from "@/interfaces/INewUser";
import IReportsFilters from "@/interfaces/IReportsFilters";
import IReportsData from "@/interfaces/IReportsData";
import {
  checkMissingColumn,
  equipmentFormDTO,
  formatLocation,
  formatTemporaryToken,
  getValue,
  objectToParams,
  setAxiosHeader,
  ungroupData,
} from "@/helpers/dto";
import { dataFormatUrl } from "@/constants";
import http from "@/http";
import { extractDate, extractHour, formatDateWithHour } from "@/helpers/date";

const defaultOption = {
  title: "Todos",
  value: null,
};

interface Estado {
  auth: IAuth | null;
  equipments: any;
  currentStationRead: any;
  currentPluviometerRead: any;
  readsStation: any;
  readsPluviometer: any;
  currentBody: any;
  currentEquipment: any;
  currentTab: number;
  metereologicalBodies: any;
  typesEquipments: any;
  users: IUsersWrapper;
  currentUser: INewUser | null;
  profile: INewUser | null;
  cityOptions: ICityOption[];
  reportsFilters: IReportsFilters;
  hydrographicBasinOptions: IHydrographicBasinOption[];
  reportsData: IReportsData;
  isLoadingReport: boolean;
}

export const key: InjectionKey<Store<Estado>> = Symbol();

const reportsDataDefault: IReportsData = {
  registeredCount: [],
  captationCount: [],
  workersCount: [],
  aquaculture: [],
  tankCaptation: [],
  securityWater: [],
  securitySocial: [],
  securityEconomic: [],
  securityProductive: [],
};

export const store = createStore<Estado>({
  modules: {
    newsletter,
  },
  state: {
    auth: null,
    currentTab: 0,
    currentBody: null,
    currentEquipment: null,
    isLoadingReport: false,
    reportsData: reportsDataDefault,
    hydrographicBasinOptions: [
      {
        title: "Alto Jaguaribe",
        value: 1,
      },
      {
        title: "Baixo Jaguaribe",
        value: 2,
      },
    ],
    metereologicalBodies: {
      data: [],
    },
    typesEquipments: {
      data: [],
    },
    cityOptions: [],
    users: {
      data: [],
      totalAdmins: 0,
      totalBasics: 0,
      totalActives: 0,
      totalInactives: 0,
    },
    equipments: {
      data: [],
      totalStations: 0,
      totalPluviometers: 0,
      apiPagination: {
        pages: 1,
        total: 0,
      },
    },
    currentStationRead: null,
    currentPluviometerRead: null,
    readsStation: {
      data: [],
      apiPagination: {
        pages: 1,
        total: 0,
      },
    },
    readsPluviometer: {
      data: [],
      apiPagination: {
        pages: 1,
        total: 0,
      },
    },
    reportsFilters: {
      showPerBasin: true,
    },
    currentUser: null,
    profile: null,
  },
  mutations: {
    ["SET_BODIES_OPTIONS"](state, options) {
      state.metereologicalBodies = options;
    },
    ["SET_CURRENT_TAB"](state, tab) {
      state.currentTab = tab;
    },
    ["SET_TYPES_EQUIPMENTS_OPTIONS"](state, options) {
      state.typesEquipments = options;
    },
    ["SET_EQUIPMENTS"](state, equipments: any) {
      state.equipments = equipments;
    },
    ["SET_STATION_READS"](state, reads: any) {
      state.readsStation = reads;
    },
    ["SET_PLUVIOMETER_READS"](state, reads: any) {
      state.readsPluviometer = reads;
    },
    ["SET_USER"](state, user: IAuth) {
      state.auth = user;
      setAxiosHeader(user?.token || "");
    },
    ["SET_LOADING_REPORT"](state, bool: boolean) {
      state.isLoadingReport = bool;
    },
    ["SET_REPORTS_DATA"](state, data) {
      state.reportsData = {
        ...reportsDataDefault,
        ...data,
      };
    },
    ["SET_OPTIONS"](state, { basins, cities }) {
      state.cityOptions = cities;
      state.hydrographicBasinOptions = basins;
    },
    ["SET_SHOW_PER_BACIN"](state, val) {
      state.reportsFilters.showPerBasin = val;
    },
    ["SET_USERS"](state, users: IUsersWrapper) {
      state.users = users;
    },
    ["SET_CURRENT_USER"](state, user) {
      state.currentUser = user;
    },
    ["SET_CURRENT_BODY"](state, UPDATE_BODY) {
      state.currentBody = UPDATE_BODY;
    },
    ["SET_CURRENT_EQUIPMENT"](state, equipment) {
      state.currentEquipment = equipment;
    },
    ["SET_CURRENT_STATION_READ"](state, read) {
      state.currentStationRead = read;
    },
    ["SET_CURRENT_PLUVIOMETER_READ"](state, read) {
      state.currentPluviometerRead = read;
    },
    ["SET_CURRENT_PROFILE"](state, user) {
      state.profile = user;
    },
  },
  actions: {
    ["SIGN_OUT"]({ commit }) {
      commit("SET_USER", null);
    },
    async ["SEND_EMAIL_CHANGE_PASSWORD"](
      context,
      { email }: { email: string }
    ) {
      try {
        await http.post(`login/password/forgot`, { email });
        toast.success("Email de recuperação enviado com sucesso.");
      } catch (e: any) {
        toast.error("Falha ao enviar email de recuperação.");

        throw Error(e?.response?.data?.error);
      }
    },
    async ["LOGIN_USER"]({ commit }, user: IUser) {
      try {
        const { data } = await http.post(`login/sign-in`, user);
        const token = data?.data?.accessToken;
        const userName = data?.data?.userName;

        if (token) {
          const userLogged = {
            login: userName,
            token,
          };

          commit("SET_USER", userLogged);

          return true;
        }
      } catch (e) {
        toast.error("Credenciais inválidas.");
        console.error(e);
      }
    },
    async ["UPDATE_SHOW_PER_BACIN"]({ commit }, val: boolean) {
      commit("SET_SHOW_PER_BACIN", val);
    },
    async ["FETCH_CENSUS"]() {
      try {
        const { data } = await http.get(`/user`);
        return true;
      } catch (e) {
        console.error(e);
      }
    },
    async ["FETCH_PLACES_OPTIONS"]({ commit }) {
      try {
        const placesDTO = (places: []) => {
          return places.map((place) => ({
            value: place["Id"],
            title: place["Local"],
            IdBacia: place["IdBacia"] || place["Id"],
          }));
        };

        const { data } = await http.get(`/census/locations`);

        let [basins, cities] = [data.data.Bacia, data.data.Municipio];
        [basins, cities] = [placesDTO(basins), placesDTO(cities)];

        commit("SET_OPTIONS", {
          basins,
          cities,
        });

        return true;
      } catch (e) {
        console.error(e);
      }
    },
    async ["FETCH_BODIES_OPTIONS"]({ commit }) {
      try {
        // const { data } = await http.get(`/census/locations`);
        const data = [
          {
            Id: 1,
            Name: "INMET",
            Host: "127.0.0.1",
            User: "root",
            Password: "1234567",
          },
          {
            Id: 2,
            Name: "FUNCEME",
            Host: "139.0.0.1",
            User: "root",
            Password: "7654321",
          },
        ];

        commit("SET_BODIES_OPTIONS", {
          data,
        });
      } catch (e) {
        console.error(e);
      }
    },
    async ["FETCH_EQUIPMENT_TYPE_OPTIONS"]({ commit }) {
      try {
        // const { data } = await http.get(`/census/locations`);
        const data = [
          {
            Id: 1,
            Name: "station",
            Title: "Estação",
          },
          {
            Id: 2,
            Name: "pluviometer",
            Title: "Pluviômetro",
          },
        ];

        commit("SET_TYPES_EQUIPMENTS_OPTIONS", {
          data,
        });
      } catch (e) {
        console.error(e);
      }
    },
    async ["FETCH_GENERAL_REPORTS"]({ commit }) {
      try {
        // TODO
        // IMPLEMENT REQUEST OF GENERAL REPORTS
        const placesDTO = (places: []) => {
          return places.map((place) => ({
            value: place["Id"],
            title: place["Local"],
            IdBacia: place["IdBacia"] || place["Id"],
          }));
        };

        const { data } = await http.get(`/census/locations`);

        let [basins, cities] = [data.data.Bacia, data.data.Municipio];
        [basins, cities] = [placesDTO(basins), placesDTO(cities)];

        commit("SET_OPTIONS", {
          basins,
          cities,
        });

        return true;
      } catch (e) {
        console.error(e);
      }
    },
    async ["FETCH_REPORT_GENERAL"]({ commit }, filters) {
      try {
        const showingDataFormat: 1 | 2 | 3 = filters.showingDataFormat.value;
        const showingDataFormatUrl = dataFormatUrl[showingDataFormat];

        const {
          data: { data: workersCount },
        } = await http.get(`/census/workers/${showingDataFormatUrl}`);
        const {
          data: { data: captationCount },
        } = await http.get(`/census/captation/${showingDataFormatUrl}`);
        const {
          data: { data: registeredCount },
        } = await http.get(`/census/census-takers/${showingDataFormatUrl}`);

        commit("SET_REPORTS_DATA", {
          workersCount,
          captationCount,
          registeredCount,
        });
      } catch (e) {
        console.error(e);
      }
    },
    async ["FETCH_REPORT_AQUACULTURE"]({ commit }, filters) {
      try {
        const showingDataFormat: 1 | 2 | 3 = filters.showingDataFormat.value;
        const showingDataFormatUrl = dataFormatUrl[showingDataFormat];

        const {
          data: { data: tankCaptation },
        } = await http.get(`/census/captation/tank/${showingDataFormatUrl}`);
        const {
          data: { data: aquaculture },
        } = await http.get(`/census/aquaculture/${showingDataFormatUrl}`);

        commit("SET_REPORTS_DATA", {
          tankCaptation,
          aquaculture,
        });
      } catch (e) {
        console.error(e);
      }
    },
    async ["FETCH_REPORT_INDICATORS"]({ commit }, filters) {
      try {
        const showingDataFormat: 1 | 2 | 3 = filters.showingDataFormat.value;
        const showingDataFormatUrl = dataFormatUrl[showingDataFormat];

        const {
          data: { data: securityWater },
        } = await http.get(
          `/census/indicator/security/water/${showingDataFormatUrl}`
        );

        const {
          data: { data: securitySocial },
        } = await http.get(
          `/census/indicator/security/social/${showingDataFormatUrl}`
        );

        const {
          data: { data: securityEconomic },
        } = await http.get(
          `/census/indicator/security/economic/${showingDataFormatUrl}`
        );

        commit("SET_REPORTS_DATA", {
          securityWater: securityWater.map(getValue).map(formatLocation),
          securitySocial: securitySocial.map(getValue).map(formatLocation),
          securityEconomic: securityEconomic.map(getValue).map(formatLocation),
          securityProductive: [],
        });
      } catch (e) {
        console.error(e);
      }
    },
    async ["FETCH_REPORT_ANIMALS"]({ commit }, filters) {
      try {
        const showingDataFormat: 1 | 2 | 3 = filters.showingDataFormat.value;
        const showingDataFormatUrl = dataFormatUrl[showingDataFormat];

        const {
          data: { data: animals },
        } = await http.get(`/census/animals/${showingDataFormatUrl}`);

        commit("SET_REPORTS_DATA", {
          animals: showingDataFormat === 3 ? animals : ungroupData(animals),
        });
      } catch (e) {
        console.error(e);
      }
    },
    async ["FETCH_REPORTS_DATA"]({ commit, dispatch }, filters) {
      try {
        commit("SET_LOADING_REPORT", true);
        const groupmentParam = filters.groupReports.value;

        if (groupmentParam === 1) {
          dispatch("FETCH_REPORT_GENERAL", filters);
        } else if (groupmentParam === 2) {
          dispatch("FETCH_REPORT_ANIMALS", filters);
        } else if (groupmentParam === 3) {
          dispatch("FETCH_REPORT_AQUACULTURE", filters);
        } else if (groupmentParam === 4) {
          dispatch("FETCH_REPORT_INDICATORS", filters);
        }
      } catch (e) {
        console.error(e);
      }

      commit("SET_LOADING_REPORT", false);
    },
    async ["CREATE_USER"]({ commit }, user: any) {
      try {
        await http.post(`/user/register/`, user);

        toast.success("Usuário criado com sucesso.");
        toast.success(`Email enviado para ${previewEmailCensured(user.email)}`);
      } catch (e: any) {
        toast.error("Falha ao criar usuário.");
        console.error(e);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["CREATE_EQUIPMENT"]({ commit }, form: any) {
      try {
        const equipment = equipmentFormDTO(form);

        await http.post(`/equipments/`, equipment);

        toast.success("Equipamento criado com sucesso.");
      } catch (e: any) {
        toast.error("Falha ao criar equipamento.");
        console.error(e);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["DELETE_USERS"]({ commit }, ids: number[]) {
      try {
        await Promise.allSettled(
          ids.map(async (id) => await http.delete(`/user/delete/${id}`))
        );

        toast.success("Sucesso ao deletar usuário(s)");
      } catch (e) {
        toast.error("Falha ao deletar usuário(s).");
        console.error(e);
      }
    },
    async ["DELETE_EQUIPMENTS"]({ commit }, ids: number[]) {
      try {
        await Promise.allSettled(
          ids.map(async (id) => await http.delete(`/equipments/${id}`))
        );

        toast.success("Sucesso ao deletar equipamento(s)");
      } catch (e) {
        toast.error("Falha ao deletar equipamento(s).");
        console.error(e);
      }
    },
    async ["UPDATE_USER"]({ state }, user: any) {
      try {
        await http.put(`/user/${state.currentUser?.id}`, user);

        toast.success("Dados de usuário atualizados com sucesso.");
      } catch (e: any) {
        toast.error("Falha ao atualizar usuário.");
        console.error(e);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["UPDATE_STATION_READ"]({ state }, read: any) {
      try {
        const formattedRead = {
          ...read,
          Time: extractDate(read.Time),
          Hour: extractHour(read.Time),
        };

        await http.put(
          `/equipments/measures/station/${read?.IdRead}`,
          formattedRead
        );

        toast.success("Dados de leitura atualizados com sucesso.");
      } catch (e: any) {
        toast.error("Falha ao atualizar dados de leitura.");
        console.error(e);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["UPDATE_PLUVIOMETER_READ"]({ state }, read: any) {
      try {
        const formattedRead = {
          ...read,
          Time: extractDate(read.Time),
          Hour: extractHour(read.Time),
        };

        await http.put(
          `/equipments/measures/pluviometer/${read?.IdRead}`,
          formattedRead
        );

        toast.success("Dados de leitura atualizados com sucesso.");
      } catch (e: any) {
        toast.error("Falha ao atualizar dados de leitura.");
        console.error(e);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["UPDATE_BODY"]({ state }, form) {
      try {
        // await http.put(`/user/${state.currentUser?.id}`, user);

        toast.success(" com sucesso.");
      } catch (e: any) {
        toast.error("Falha ao atualizar usuário.");
        console.error(e);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["UPDATE_PROFILE"]({ state, commit }, user: any) {
      try {
        await http.put(`/user/profile/`, {
          ...state.profile,
          email: user.email,
          name: user.name,
          login: user.login,
        });

        const auth = {
          ...state.auth,
          login: user.name,
        };

        commit("SET_USER", auth);

        toast.success("Dados de usuário atualizados com sucesso.");
      } catch (e: any) {
        toast.error("Falha ao atualizar dados.");
        toast.error(e?.response?.data?.error);
        console.error(e);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["UPDATE_EQUIPMENT"]({ state, commit }, form: any) {
      try {
        const equipment = equipmentFormDTO(form);

        await http.put(`/equipments/${equipment.Id}`, equipment);

        toast.success("Dados do equipamento atualizados com sucesso");
      } catch (e: any) {
        toast.error("Falha ao atualizar dados.");
        toast.error(e?.response?.data?.error);
        console.error(e);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["CHANGE_PASSWORD"](context, form) {
      try {
        await http.post(
          `login/password/reset`,
          { ...form, token: `Bearer ${form.token}` },
          formatTemporaryToken(form.token)
        );
        toast.success("Senha atualizada com sucesso.");
        return true;
      } catch (e: any) {
        toast.error("Erro ao alterar senha.");
        toast.error(e?.response?.data?.error);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["GET_CURRENT_USER"]({ commit }, id: number) {
      const {
        data: { data },
      } = await http.get(`/user/list?userId=${id}`);
      commit("SET_CURRENT_USER", data);
    },
    async ["GET_CURRENT_BODY"]({ state, commit, dispatch }, id: number) {
      try {
        await dispatch("FETCH_BODIES_OPTIONS");

        const equipment = state.metereologicalBodies.data.find(
          (c: { Id: number }) => c.Id == id
        );
        commit("SET_CURRENT_BODY", equipment);
      } catch (e) {
        console.error(e);
      }
    },
    async ["GET_CURRENT_EQUIPMENT"]({ state, commit, dispatch }, id: number) {
      try {
        await dispatch("GET_EQUIPMENTS");

        const {
          data: {
            data: { Equipments: equipments },
          },
        } = await http.get(`/equipments/${id}`);

        console.log("tentando buscar dado aqui", equipments);

        const equipment = state.equipments.data.find(
          (c: { Id: number }) => c.Id == id
        );

        console.log({ equipment });
        commit("SET_CURRENT_EQUIPMENT", equipment);
      } catch (e) {
        console.error(e);
      }
    },
    async ["GET_CURRENT_STATION_READ"]({ commit }, id: number) {
      try {
        const {
          data: { data: read },
        } = await http.get(`/equipments/measures/station/${id}`);

        const unWrappedValue = getValue(read, "Value");
        const formattedDateValue = {
          ...unWrappedValue,
          Time: formatDateWithHour(unWrappedValue.Time, unWrappedValue.Hour),
        };

        commit("SET_CURRENT_STATION_READ", formattedDateValue);
      } catch (e) {
        console.error(e);
      }
    },
    async ["GET_CURRENT_PLUVIOMETER_READ"](
      { state, commit, dispatch },
      id: number
    ) {
      try {
        const {
          data: { data: read },
        } = await http.get(`/equipments/measures/pluviometer/${id}`);

        const unWrappedValue = getValue(read, "Value");
        const formattedDateValue = {
          ...unWrappedValue,
          Time: formatDateWithHour(unWrappedValue.Time, unWrappedValue.Hour),
        };

        commit("SET_CURRENT_PLUVIOMETER_READ", formattedDateValue);
      } catch (e) {
        console.error(e);
      }
    },
    async ["GET_PROFILE"]({ commit }, id: number) {
      const {
        data: { data },
      } = await http.get(`/user/profile`);

      commit("SET_CURRENT_PROFILE", data);
    },
    async ["GET_USERS"]({ commit }) {
      try {
        const {
          data: { data: users },
        } = await http.get(`/user/list`);

        commit("SET_USERS", {
          data: users,
          totalAdmins: users.filter((u: any) => u.type === "admin").length,
          totalBasics: users.filter((u: any) => u.type !== "admin").length,
          totalActives: 0,
          totalInactives: 0,
        });
      } catch (e) {
        toast.error("Erro ao buscar usuários.");
      }
    },
    async ["GET_EQUIPMENTS"]({ commit }) {
      try {
        const {
          data: {
            data: { Equipments: equipments },
          },
        } = await http.get(`/equipments/`);

        const equipmentType = ["Estação", "Pluviômetro"];

        equipments.map((equip: any) => {
          equip.Location = equip.Location?.Name;
          equip.Organ = equip.Organ.Name;
          equip.Type = equip.Type.Name || "station";
          equip.NomeTipoEquipamento =
            equip.Type === "pluviometer" ? equipmentType[1] : equipmentType[0];
          return equip;
        });

        commit("SET_EQUIPMENTS", {
          data: equipments,
          totalPluviometers: equipments.filter(
            (d: any) => d.NomeTipoEquipamento === "Pluviômetro"
          ).length,
          totalStations: equipments.filter(
            (d: any) => d.NomeTipoEquipamento === "Estação"
          ).length,
        });
      } catch (e) {
        console.error(e);
        toast.error("Erro ao buscar equipamentos.");
      }
    },
    async ["GET_STATION_READS"]({ commit }, filters = {}) {
      try {
        const params = {
          idEquipment: filters._itemId,
          start: filters.start,
          end: filters.end,
          pageNumber: filters.pageNumber,
        };

        const {
          data: {
            data: {
              Measures: reads,
              QtdPages: pages,
              QtdRows: total,
              PageLimitRows: pageLimit,
            },
          },
        } = await http.get(
          `/equipments/measures/stations${objectToParams(params)}`
        );

        commit("SET_STATION_READS", {
          data: reads.map((c: any) => {
            c.hasMissingColumn = checkMissingColumn({ ...c }, "Value");
            c.id = c.IdRead;
            c.FullTime = formatDateWithHour(c.Time, c.Hour);

            return c;
          }),
          apiPagination: {
            pages,
            total,
            pageLimit,
          },
        });
      } catch (e) {
        console.error(e);
        toast.error("Erro ao buscar dados de leitura");
      }
    },
    async ["GET_PLUVIOMETER_READS"]({ commit }, filters = {}) {
      try {
        const params = {
          idEquipment: filters._itemId,
          start: filters.start,
          end: filters.end,
          pageNumber: filters.pageNumber,
        };

        const {
          data: {
            data: {
              Measures: reads,
              QtdPages: pages,
              QtdRows: total,
              PageLimitRows: pageLimit,
            },
          },
        } = await http.get(
          `/equipments/measures/pluviometers${objectToParams(params)}`
        );

        commit("SET_PLUVIOMETER_READS", {
          data: reads.map((c: any) => {
            c.id = c.IdRead;
            c.hasMissingColumn = checkMissingColumn({ ...c }, "Value");
            c.FullTime = formatDateWithHour(c.Time, c.Hour);

            return c;
          }),
          apiPagination: {
            pages,
            total,
            pageLimit,
          },
        });
      } catch (e) {
        console.error(e);
        toast.error("Erro ao buscar dados de leitura");
      }
    },
    async ["INITIAL_REGISTER"]({ commit }, params) {
      try {
        const { token, ...form } = params;

        const {
          data: { data },
        } = await http.post(
          `/login/sign-up`,
          form,
          formatTemporaryToken(token)
        );

        if (data) {
          const userLogged = {
            login: data.userName,
            token,
          };

          setAxiosHeader(userLogged.token);
          commit("SET_USER", userLogged);
        }

        toast.success("Sucesso ao finalizar edição de usuário.");
      } catch (e: any) {
        toast.error("Erro ao finalizar edição de usuário.");
        toast.error(e?.response?.data?.error);
        throw Error(e?.response?.data?.error);
      }
    },
  },
  getters: {
    bodiesOptions(state) {
      const bodiesDTO = (bodies: { Name: string; Id: number }[]) => {
        return bodies.map((bodie) => ({
          value: bodie["Id"],
          title: bodie["Name"],
        }));
      };

      return [defaultOption, ...bodiesDTO(state.metereologicalBodies.data)];
    },
    equipmentTypeOptions(state) {
      const typesEquips = (
        typesEquips: { Name: string; Title: string; Id: number }[]
      ) => {
        return typesEquips.map((typeEquip) => ({
          value: typeEquip["Id"],
          title: typeEquip["Title"],
          key: typeEquip["Name"],
        }));
      };

      return [defaultOption, ...typesEquips(state.typesEquipments.data)];
    },
    equipmentOptions(state) {
      console.log("testezim", state.equipments.data);
      const typesEquips = (typesEquips: any[]) => {
        return typesEquips.map((equip) => {
          const title = ["Name", "Code"].map((c) => equip[c]).join(" - ");

          return {
            value: equip["Id"],
            title,
            id: equip["Id"],
          };
        });
      };

      return typesEquips(state.equipments.data);
    },
  },
});

export function useStore(): Store<Estado> {
  return vuexUseStore(key);
}

export default store;
