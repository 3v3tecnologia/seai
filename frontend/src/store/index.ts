import "vue3-toastify/dist/index.css";
import { createStore, Store, useStore as vuexUseStore } from "vuex";
import { toast } from "vue3-toastify";
import { InjectionKey } from "vue";

import IAuth from "@/interfaces/IAuth";
import IUser from "@/interfaces/IUser";
import IUsersWrapper from "@/interfaces/IUsersWrapper";
import ICityOption from "@/interfaces/ICityOption";
import IHydrographicBasinOption from "@/interfaces/IHydrographicBasinOption";
import http from "@/http";

import { previewEmailCensured } from "@/helpers/formatEmail";
import INewUser from "@/interfaces/INewUser";
import IReportsFilters from "@/interfaces/IReportsFilters";
import IReportsData from "@/interfaces/IReportsData";

const formatTemporaryToken = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const dataFormatUrl = {
  1: "basin",
  2: "county",
  3: "consumption",
};

const setAxiosHeader = (token: string) =>
  (http.defaults.headers.common["Authorization"] = `Bearer ${token}`);

const getValor = (item: any) => {
  const keys = Object.keys(item);

  keys.forEach((key) => {
    if (item[key].valor) {
      item[key] = item[key]["valor"];
    }
  });

  if (item.Tipo === "bacia") {
    item["Bacia"] = item["Nome"];
  } else {
    item["Municipio"] = item["Nome"];
  }

  return item;
};

const ungroupData = (items: any) => {
  const keys = Object.keys(items);
  const totalData: { [x: string]: number | string }[] = [];

  keys.forEach((key) => {
    const data = items[key].map((i: any) => {
      i.Bacia = key;
      i.Municipio = key;

      return i;
    });

    totalData.push(...data);
  });

  return totalData;
};

interface Estado {
  auth: IAuth | null;
  equipments: any;
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
  state: {
    auth: null,
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
    cityOptions: [
      {
        title: "Fortaleza",
        value: 1,
      },
      {
        title: "Crato",
        value: 2,
      },
    ],
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
    },
    reportsFilters: {
      showPerBasin: true,
    },
    currentUser: null,
    profile: null,
  },
  mutations: {
    ["SET_EQUIPMENTS"](state, equipments: any) {
      state.equipments = equipments;
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
      // const user = state.users.data.find((usr) => usr.id == id);
      // const user = state.users.data.find((usr) => usr.id);
      state.currentUser = user;
    },
    ["SET_CURRENT_PROFILE"](state, user) {
      // const user = state.users.data.find((usr) => usr.id == id);
      // const user = state.users.data.find((usr) => usr.id);
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

          toast.success("Logado com sucesso.");
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
        console.log({ data });
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
          securityWater: securityWater.map(getValor),
          securitySocial: securitySocial.map(getValor),
          securityEconomic: securityEconomic.map(getValor),
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
        const data = [
          {
            id: 1,
            NomeEquipamento: "Pluviômetro Francisca",
            IdExterno: "12344222",
            NomeOrgao: "INMET",
            NomeTipoEquipamento: "pluviometer",
            NomeLocalização: "Mossoró",
            PossuiErrosDeLeituraPendentes: true,
          },
          {
            id: 1,
            NomeEquipamento: "Estação Joaquim",
            IdExterno: "123Hfds",
            NomeOrgao: "FUNCEME",
            NomeTipoEquipamento: "station",
            NomeLocalização: "Fortaleza",
            PossuiErrosDeLeituraPendentes: false,
          },
        ];

        commit("SET_EQUIPMENTS", {
          data,
          totalPluviometers: data.filter(
            (d: any) => d.NomeTipoEquipamento === "pluviometer"
          ).length,
          totalStations: data.filter(
            (d: any) => d.NomeTipoEquipamento === "station"
          ).length,
        });
      } catch (e) {
        toast.error("Erro ao buscar usuários.");
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
});

export function useStore(): Store<Estado> {
  return vuexUseStore(key);
}

export default store;
