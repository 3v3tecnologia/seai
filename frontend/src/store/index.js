import "vue3-toastify/dist/index.css";
import { createStore, useStore as vuexUseStore } from "vuex";
import { toast } from "vue3-toastify";

import modules from "./modules";

import { previewEmailCensured } from "@/helpers/formatEmail";
import { extractDate, extractHour, formatDateWithHour } from "@/helpers/date";
import {
  checkMissingColumn,
  equipmentFormDTO,
  formatTemporaryToken,
  getValue,
  objectToParams,
  setAxiosHeader,
  unwrapEquip,
} from "@/helpers/dto";

import { defaultOption, limit } from "@/constants";

import http from "@/http";
import { clearToken, storeToken } from "@/helpers/auth";

export const key = Symbol();

export const store = createStore({
  modules,
  state: {
    auth: null,
    currentTab: 0,
    currentBody: null,
    currentEquipment: null,
    metereologicalBodies: {
      data: [],
    },
    typesEquipments: {
      data: [],
    },
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
    ["SET_EQUIPMENTS"](state, equipments) {
      state.equipments = equipments;
    },
    ["SET_STATION_READS"](state, reads) {
      state.readsStation = reads;
    },
    ["SET_PLUVIOMETER_READS"](state, reads) {
      state.readsPluviometer = reads;
    },
    ["SET_USER"](state, user) {
      state.auth = user;
      setAxiosHeader(user?.token || "");
    },
    ["SET_SHOW_PER_BACIN"](state, val) {
      state.reportsFilters.showPerBasin = val;
    },
    ["SET_USERS"](state, users) {
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
      clearToken();
      commit("SET_USER", null);
    },
    async ["SEND_EMAIL_CHANGE_PASSWORD"](context, { email }) {
      try {
        await http.post(`login/password/forgot`, { email });
        toast.success("Email de recuperação enviado com sucesso");
      } catch (e) {
        toast.error("Falha ao enviar email de recuperação");

        throw Error(e?.response?.data?.error);
      }
    },
    async ["LOGIN_USER"]({ commit }, user) {
      try {
        const { data } = await http.post(`login/sign-in`, user);
        const token = data?.data?.accessToken;
        const userName = data?.data?.userName;

        if (token) {
          storeToken(token);
          const userLogged = {
            login: userName,
            token,
          };

          commit("SET_USER", userLogged);

          return true;
        }
      } catch (e) {
        toast.error("Credenciais inválidas");
        console.error(e);
      }
    },
    async ["UPDATE_SHOW_PER_BACIN"]({ commit }, val) {
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
        const placesDTO = (places) => {
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
    async ["CREATE_USER"]({ commit }, user) {
      try {
        await http.post(`/user/register/`, user);

        toast.success("Usuário criado com sucesso");
        toast.success(`Email enviado para ${previewEmailCensured(user.email)}`);
      } catch (e) {
        toast.error("Falha ao criar usuário");
        console.error(e);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["CREATE_EQUIPMENT"]({ commit }, form) {
      try {
        const equipment = equipmentFormDTO(form);

        await http.post(`/equipments/`, equipment);

        toast.success("Equipamento criado com sucesso");
      } catch (e) {
        toast.error("Falha ao criar equipamento");
        console.error(e);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["DELETE_USERS"]({ commit }, ids) {
      try {
        await Promise.allSettled(
          ids.map(async (id) => await http.delete(`/user/delete?id=${id}`))
        );

        toast.success("Sucesso ao deletar usuário(s)");
      } catch (e) {
        toast.error("Falha ao deletar usuário(s)");
        console.error(e);
      }
    },
    async ["DELETE_EQUIPMENTS"]({ commit }, ids) {
      try {
        await Promise.allSettled(
          ids.map(async (id) => await http.delete(`/equipments/${id}`))
        );

        toast.success("Sucesso ao deletar equipamento(s)");
      } catch (e) {
        toast.error("Falha ao deletar equipamento(s)");
        console.error(e);
      }
    },
    async ["UPDATE_USER"]({ state }, user) {
      try {
        await http.put(`/user/${state.currentUser?.id}`, user);

        toast.success("Dados de usuário atualizados com sucesso");
      } catch (e) {
        toast.error("Falha ao atualizar usuário");
        console.error(e);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["UPDATE_STATION_READ"]({ state }, read) {
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

        toast.success("Dados de leitura atualizados com sucesso");
      } catch (e) {
        toast.error("Falha ao atualizar dados de leitura");
        console.error(e);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["UPDATE_PLUVIOMETER_READ"]({ state }, read) {
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

        toast.success("Dados de leitura atualizados com sucesso");
      } catch (e) {
        toast.error("Falha ao atualizar dados de leitura");
        console.error(e);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["UPDATE_BODY"]({ state }, form) {
      try {
        // await http.put(`/user/${state.currentUser?.id}`, user);

        toast.success(" com sucesso");
      } catch (e) {
        toast.error("Falha ao atualizar usuário");
        console.error(e);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["UPDATE_PROFILE"]({ state, commit }, user) {
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

        toast.success("Dados de usuário atualizados com sucesso");
      } catch (e) {
        toast.error("Falha ao atualizar dados");
        toast.error(e?.response?.data?.error);
        console.error(e);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["UPDATE_EQUIPMENT"]({ state, commit }, form) {
      try {
        const equipment = equipmentFormDTO(form);

        await http.put(`/equipments/${equipment.Id}`, equipment);

        toast.success("Dados do equipamento atualizados com sucesso");
      } catch (e) {
        toast.error("Falha ao atualizar dados");
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
        toast.success("Senha atualizada com sucesso");
        return true;
      } catch (e) {
        toast.error("Erro ao alterar senha");
        toast.error(e?.response?.data?.error);
        throw Error(e?.response?.data?.error);
      }
    },
    async ["GET_CURRENT_USER"]({ commit }, id) {
      try {
        const {
          data: { data },
        } = await http.get(`/user/list?userId=${id}`);
        commit("SET_CURRENT_USER", data);

        if (!data) {
          throw new Error("Usuário não encontrado");
        }
      } catch (e) {
        throw new Error("Usuário não encontrado");
      }
    },
    async ["GET_CURRENT_BODY"]({ state, commit, dispatch }, id) {
      try {
        await dispatch("FETCH_BODIES_OPTIONS");

        const equipment = state.metereologicalBodies.data.find(
          (c) => c.Id == id
        );
        commit("SET_CURRENT_BODY", equipment);
      } catch (e) {
        console.error(e);
      }
    },
    async ["GET_CURRENT_EQUIPMENT"]({ state, commit, dispatch }, id) {
      try {
        const {
          data: { data: equipment },
        } = await http.get(`/equipments?equipmentId=${id}`);

        commit("SET_CURRENT_EQUIPMENT", unwrapEquip(equipment));
      } catch (e) {
        console.error(e);
      }
    },
    async ["GET_CURRENT_STATION_READ"]({ commit }, id) {
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
    async ["GET_CURRENT_PLUVIOMETER_READ"]({ state, commit, dispatch }, id) {
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
    async ["GET_PROFILE"]({ commit }, token) {
      try {
        if (token && token.length) {
          setAxiosHeader(token);
        }

        const {
          data: { data },
        } = await http.get(`/user/profile`);

        if (token) {
          const userLogged = {
            login: data.name,
            token,
          };

          commit("SET_USER", userLogged);
        }

        commit("SET_CURRENT_PROFILE", data);
      } catch (e) {
        clearToken();

        toast.error("Erro de autenticação");
      }
    },
    async ["GET_USERS"]({ commit }) {
      try {
        const {
          data: { data: users },
        } = await http.get(`/user/list`);

        commit("SET_USERS", {
          data: users,
          totalAdmins: users.filter((u) => u.type === "admin").length,
          totalBasics: users.filter((u) => u.type !== "admin").length,
          totalActives: 0,
          totalInactives: 0,
        });
      } catch (e) {
        toast.error("Erro ao buscar usuários");
      }
    },
    async ["GET_EQUIPMENTS"]({ commit }) {
      try {
        const {
          data: {
            data: { Equipments: equipments },
          },
        } = await http.get(`/equipments/`);

        equipments.map(unwrapEquip);

        commit("SET_EQUIPMENTS", {
          data: equipments,
          totalPluviometers: equipments.filter(
            (d) => d.NomeTipoEquipamento === "Pluviômetro"
          ).length,
          totalStations: equipments.filter(
            (d) => d.NomeTipoEquipamento === "Estação"
          ).length,
        });
      } catch (e) {
        console.error(e);
        toast.error("Erro ao buscar equipamentos");
      }
    },
    async ["GET_STATION_READS"]({ state, commit, dispatch }, filters = {}) {
      try {
        const params = {
          idEquipment: filters._itemId,
          start: filters.start,
          end: filters.end,
          pageNumber: filters.pageNumber,
          limit,
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

        await dispatch("GET_EQUIPMENT_NAME_FORMATTED", params.idEquipment);

        commit("SET_STATION_READS", {
          data: reads.map((c) => {
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
    async ["GET_EQUIPMENT_NAME_FORMATTED"](
      { state, commit, dispatch },
      idEquipment
    ) {
      await dispatch("GET_CURRENT_EQUIPMENT", idEquipment);

      const { Organ, NomeTipoEquipamento, Name } = state.currentEquipment;

      const nameShowing = `${NomeTipoEquipamento} ${Organ} | ${Name}`;
      commit("SET_PAGE_TITLE", nameShowing);
    },
    async ["GET_PLUVIOMETER_READS"]({ state, commit, dispatch }, filters = {}) {
      try {
        const params = {
          idEquipment: filters._itemId,
          start: filters.start,
          end: filters.end,
          limit,
          pageNumber: filters.pageNumber,
        };

        await dispatch("GET_EQUIPMENT_NAME_FORMATTED", params.idEquipment);

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
          data: reads.map((c) => {
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

        toast.success("Sucesso ao finalizar edição de usuário");
      } catch (e) {
        toast.error("Erro ao finalizar edição de usuário");
        toast.error(e?.response?.data?.error);
        throw Error(e?.response?.data?.error);
      }
    },
  },
  getters: {
    bodiesOptions(state) {
      const bodiesDTO = (bodies) => {
        return bodies.map((bodie) => ({
          value: bodie["Id"],
          title: bodie["Name"],
        }));
      };

      return [defaultOption, ...bodiesDTO(state.metereologicalBodies.data)];
    },
    equipmentTypeOptions(state) {
      const typesEquips = (typesEquips) => {
        return typesEquips.map((typeEquip) => ({
          value: typeEquip["Id"],
          title: typeEquip["Title"],
          key: typeEquip["Name"],
        }));
      };

      return [defaultOption, ...typesEquips(state.typesEquipments.data)];
    },
    equipmentOptions(state) {
      const typesEquips = (typesEquips) => {
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

export function useStore() {
  return vuexUseStore(key);
}

export default store;
