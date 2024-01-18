import http from "@/http";
import { reportsDataDefault, mockedHydricResources } from "../mocks";
import { dataFormatUrl } from "@/constants";
import { formatLocation, getValueBasic, ungroupData } from "@/helpers/dto";

export default {
  state: () => ({
    isLoadingReport: false,
    reportsData: reportsDataDefault,
    currentBasinName: "",
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
    ["SET_CURRENT_BASIN_NAME"](state, basinName) {
      state.currentBasinName = basinName;
    },
  },
  actions: {
    async ["FETCH_REPORT_GENERAL"]({ commit }, filters) {
      try {
        const showingDataFormat = filters.showingDataFormat.value;
        const showingDataFormatUrl = dataFormatUrl[showingDataFormat];

        const responses = await Promise.all([
          await http.get(`/census/workers/${showingDataFormatUrl}`),
          await http.get(`/census/captation/${showingDataFormatUrl}`),
          await http.get(`/census/census-takers/${showingDataFormatUrl}`),
        ]);

        const [workersCount, captationCount, registeredCount] = responses.map(
          (c) => c.data.data
        );

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

        const responses = await Promise.all([
          await http.get(`/census/captation/tank/${showingDataFormatUrl}`),
          await http.get(`/census/aquaculture/${showingDataFormatUrl}`),
        ]);

        const [tankCaptation, aquaculture] = responses.map((c) => c.data.data);

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

        const responses = await Promise.all([
          await http.get(
            `/census/indicator/security/water/${showingDataFormatUrl}`
          ),
          await http.get(
            `/census/indicator/security/social/${showingDataFormatUrl}`
          ),
          await http.get(
            `/census/indicator/security/economic/${showingDataFormatUrl}`
          ),
        ]);

        const [securityWater, securitySocial, securityEconomic] = responses.map(
          (c) => c.data.data.map(getValueBasic).map(formatLocation)
        );

        commit("SET_REPORTS_DATA", {
          securityWater,
          securitySocial,
          securityEconomic,
          securityProductive: [],
        });
      } catch (e) {
        console.error(e);
      }
    },
    async ["FETCH_REPORT_RESOURCES"]({ state, commit }, filters) {
      try {
        const showingDataFormat = filters.showingDataFormat.value;
        const showingDataFormatUrl = dataFormatUrl[showingDataFormat];

        const responses = await Promise.all([
          await http.get(`/census/captation/tank/${showingDataFormatUrl}`),
          await http.get(`/census/aquaculture/${showingDataFormatUrl}`),
        ]);

        const hydricResourcesRaw = mockedHydricResources[showingDataFormatUrl];
        const basinKey = Object.keys(hydricResourcesRaw)[0];
        commit("SET_CURRENT_BASIN_NAME", basinKey);

        const hydricResources = hydricResourcesRaw[basinKey]
          .map(getValueBasic)
          .map(formatLocation)
          .map((c) => {
            c.Bacia = basinKey;
            return c;
          });

        commit("SET_REPORTS_DATA", {
          hydricResources,
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
        } else if (groupmentParam === 5) {
          await dispatch("FETCH_REPORT_RESOURCES", filters);
        }
      } catch (e) {
        console.error(e);
      } finally {
        commit("SET_LOADING_REPORT", false);
      }
    },
  },
};
