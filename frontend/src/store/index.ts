import moment from "moment";
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

interface Estado {
  auth: IAuth | null;
  users: IUsersWrapper;
  currentUser: INewUser | null;
  cityOptions: ICityOption[];
  reportsFilters: IReportsFilters;
  hydrographicBasinOptions: IHydrographicBasinOption[];
}

export const key: InjectionKey<Store<Estado>> = Symbol();

export const store = createStore<Estado>({
  state: {
    auth: null,
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
    reportsFilters: {
      showPerBasin: true,
    },
    currentUser: null,
  },
  mutations: {
    ["SET_USER"](state, user: IAuth) {
      state.auth = user;
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
    ["SET_CURRENT_USER"](state) {
      // const user = state.users.data.find((usr) => usr.id == id);
      const user = state.users.data.find((usr) => usr.id);
      state.currentUser = user || null;
    },
  },
  actions: {
    ["SIGN_OUT"]({ commit }) {
      commit("SET_USER", null);
    },
    async ["SEND_EMAIL_CHANGE_PASSWORD"]() {
      try {
        // TODO
        // SEND HERE TO API THE OBJECT WITH LOGIN AND OR EMAIL
        // const { data: userCreated } = await http.post(`/user`, user);
        toast.success("Email de recuperação enviado com sucesso.");
      } catch (e) {
        toast.error("Falha ao enviar email de recuperação.");
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
            id: 1,
            token,
          };

          http.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${userLogged.token}`;
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
    async ["CREATE_USER"](user: any) {
      try {
        const createdUser = Object.assign({}, user);
        // TODO
        // CONNECT API
        // const { data: userLogged } = await http.post(`/auth`, user);
        const newId = Math.floor(Math.random() * (10000 - 1) + 1);
        createdUser.id = newId;
        createdUser.created_at = moment(new Date()).format("YYYY/MM/DD");

        toast.success("Usuário criado com sucesso.");
        toast.success(`Email enviado para ${previewEmailCensured(user.email)}`);
        return true;
      } catch (e) {
        toast.error("Falha ao criar usuário.");
      }
    },
    async ["UPDATE_USER"](_context, _user: INewUser) {
      try {
        // TODO
        // CONNECT API
        toast.success("Dados do usuário atualizados com sucesso.");
      } catch (e) {
        toast.error("Falha ao atualizar dados do usuário.");
      }
    },
    async ["CHANGE_PASSWORD"]() {
      try {
        // TODO
        // CONNECT API
        // const { data: userLogged } = await http.post(`/change-password`, {password, token});

        toast.success("Senha atualizada com sucesso.");
        return true;
      } catch (e) {
        toast.error("Credenciais inválidas.");
      }
    },
    // async ["CREATE_USER"]({ commit }, form) {
    //   try {
    //     // TODO
    //     // CONNECT API
    //     // const { data: userLogged } = await http.post(`/change-password`, {password, token});

    //     toast.success("Conta criada com sucesso.");
    //     toast.success(`Email enviado para ${previewEmailCensured(form.email)}`);
    //     return true;
    //   } catch (e) {
    //     toast.error("Erro ao criar usuário.");
    //   }
    // },
    async ["GET_CURRENT_USER"]({ commit }, id: number) {
      commit("SET_CURRENT_USER", id);
    },
    async ["GET_USERS"]({ commit }) {
      try {
        // TODO
        // CONNECT API
        // const { data: users } = await http.get(`/users);

        const generateRandomInt = (max: number, min: number) =>
          Math.floor(Math.random() * (max - min) + min);

        const arrayLength = generateRandomInt(130, 50);

        const mockedUsers = Array.from(Array(arrayLength).keys()).map(
          (index) => {
            const myRandomNumber = generateRandomInt(1000, 0);
            const role = index % 2 ? "Administradores" : "Básico";

            return {
              name: `user${myRandomNumber}`,
              email: `etc${myRandomNumber}@gmail.com`,
              created_at: "2022-08-02 09:15:54.000",
              role,
              status: (index + myRandomNumber) % 2,
              id: myRandomNumber,
            };
          }
        );

        const totalAdmins = mockedUsers.filter(
          (usr) => usr.role === "Básico"
        ).length;
        const totalBasics = mockedUsers.filter(
          (usr) => usr.role === "Administradores"
        ).length;
        const totalActives = mockedUsers.filter((usr) => usr.status).length;
        const totalInactives = mockedUsers.filter((usr) => !usr.status).length;

        const usersDTO = {
          data: mockedUsers,
          totalAdmins,
          totalBasics,
          totalActives,
          totalInactives,
        };

        commit("SET_USERS", usersDTO);
      } catch (e) {
        toast.error("Credenciais inválidas.");
      }
    },
  },
});

export function useStore(): Store<Estado> {
  return vuexUseStore(key);
}

export default store;
