import http from "@/http";
import { reportsDataDefault } from "../mocks";
import { dataFormatUrl } from "@/constants";
import { formatLocation, getValueBasic, ungroupData } from "@/helpers/dto";

export default {
  state: () => ({
    isLoadingReport: false,
    reportsData: reportsDataDefault,
  }),
  mutations: {
    ["SET_REPORTS_DATA"](state, data) {
      state.reportsData = {
        ...reportsDataDefault,
        ...data,
      };
    },
    ["SET_LOADING_REPORT"](state, bool) {
      state.isLoadingReport = bool;
    },
  },
  actions: {
    async ["FETCH_REPORT_GENERAL"]({ commit }, filters) {
      try {
        const showingDataFormat = filters.showingDataFormat.value;
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
        const showingDataFormat = filters.showingDataFormat.value;
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
        const showingDataFormat = filters.showingDataFormat.value;
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
          securityWater: securityWater.map(getValueBasic).map(formatLocation),
          securitySocial: securitySocial.map(getValueBasic).map(formatLocation),
          securityEconomic: securityEconomic
            .map(getValueBasic)
            .map(formatLocation),
          securityProductive: [],
        });
      } catch (e) {
        console.error(e);
      }
    },
    async ["FETCH_REPORT_ANIMALS"]({ commit }, filters) {
      try {
        const showingDataFormat = filters.showingDataFormat.value;
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
          await dispatch("FETCH_REPORT_GENERAL", filters);
        } else if (groupmentParam === 2) {
          await dispatch("FETCH_REPORT_ANIMALS", filters);
        } else if (groupmentParam === 3) {
          await dispatch("FETCH_REPORT_AQUACULTURE", filters);
        } else if (groupmentParam === 4) {
          await dispatch("FETCH_REPORT_INDICATORS", filters);
        }
      } catch (e) {
        console.error(e);
      } finally {
        commit("SET_LOADING_REPORT", false);
      }
    },
  },
};
