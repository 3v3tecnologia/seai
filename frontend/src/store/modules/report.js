import http from "@/http";
import {
  reportsDataDefault,
  mockedHydricResources,
  reportsDataAllDefault,
} from "../mocks";
import { dataFormatUrl } from "@/constants";
import {
  concatBasinValues,
  formatLocation,
  getValueBasic,
  ungroupData,
} from "@/helpers/dto";

export default {
  state: () => ({
    cityOptions: [],
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
    isLoadingReport: false,
    reportsData: reportsDataDefault,
    currentBasinFilter: [],
    reportsDataAll: reportsDataAllDefault,
  }),
  mutations: {
    ["SET_OPTIONS"](state, { basins, cities }) {
      state.cityOptions = cities;
      state.hydrographicBasinOptions = basins;
    },
    ["SET_REPORTS_DATA"](state, data) {
      state.reportsData = {
        ...reportsDataDefault,
        ...data,
      };
    },
    ["SET_LOADING_REPORT"](state, bool) {
      state.isLoadingReport = bool;
    },
    ["SET_CURRENT_BASIN_NAME"](state, basins) {
      const currentValues = concatBasinValues(state.currentBasinFilter);
      const newValues = concatBasinValues(basins);

      if (currentValues != newValues) state.currentBasinFilter = basins;
    },
    ["SET_REPORTS_DATA_ALL"](state, data) {
      state.reportsDataAll = {
        ...reportsDataAllDefault,
        ...data,
      };
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
    async ["FETCH_REPORT_CULTURE_INDICATORS"](
      { state, commit, dispatch },
      filters
    ) {
      try {
        const showingDataFormat = filters.showingDataFormat.value;
        const showingDataFormatUrl = dataFormatUrl[showingDataFormat];

        const hydrographicBasin = filters.hydrographicBasin?.[0]?.value;

        await dispatch("FETCH_FIRST_BASIN", hydrographicBasin);

        const currentBasinId = state.currentBasinFilter[0].value;

        const responses = await Promise.all([
          await http.get(`/census/cultures/${currentBasinId}`),
        ]);

        console.log(
          "waaaaw",
          responses.map((c) => c.data.data[0].Cultures)
        );
        const [securityWater, securitySocial, securityEconomic] = responses.map(
          (c) => c.data.data.map(getValueBasic).map(formatLocation)
        );
        const cultureSwapperMocked = (d) => {
          const mockedMapping = {
            "Alto Jaguaribe": "Banana",
            "Médio Jaguaribe": "Laranja",
            "Baixo Jaguaribe": "Limão",
          };
          return d.map((row) => {
            row.Cultura = mockedMapping[row.Bacia];

            return row;
          });
        };

        const securityProductive = securityEconomic.map((s) => {
          s.PesoPorArea = Math.floor(Math.sqrt(s.RentabilidadePorArea));
          return s;
        });

        if (!state.reportsDataAll.hydroResourcesAll) {
          commit("SET_REPORTS_DATA_ALL", {
            hydricResources: mockedHydricResources,
          });
        }

        const hydricResourcesRaw = state.reportsDataAll.hydricResources;

        await dispatch("FETCH_SINGLE_BASIN", {
          ...filters,
          currentReportData: hydricResourcesRaw,
        });

        // "random" key
        let basinKey = state.currentBasinFilter[0].title;
        const hydricResources = hydricResourcesRaw[basinKey]
          .map(getValueBasic)
          .map(formatLocation)
          .map((c) => {
            c.Bacia = basinKey;
            return c;
          });

        commit("SET_REPORTS_DATA", {
          securityWater: cultureSwapperMocked(securityWater),
          securitySocial: cultureSwapperMocked(securitySocial),
          securityEconomic: cultureSwapperMocked(securityEconomic),
          securityProductive: cultureSwapperMocked(securityProductive),
          hydricResources,
        });
      } catch (e) {
        console.error(e);
      }
    },
    async ["FETCH_FIRST_BASIN"](
      { state, commit, dispatch },
      hydrographicBasin
    ) {
      await dispatch("FETCH_PLACES_OPTIONS");

      const firstBasin = Object.values(state.hydrographicBasinOptions)[0];
      const currentBasinFilter = state.currentBasinFilter;

      if (!currentBasinFilter?.length) {
        commit("SET_CURRENT_BASIN_NAME", [firstBasin]);
      }

      console.log(
        "pedindo o bixo pra setar o basin",
        hydrographicBasin,
        currentBasinFilter,
        firstBasin
      );
    },
    async ["FETCH_SINGLE_BASIN"]({ state, commit, dispatch }, filters) {
      const currentReportData = filters.currentReportData;
      const hydrographicBasinIndexes = Object.keys(filters.hydrographicBasin);
      const lastHydrographicBasin =
        filters.hydrographicBasin?.[
          hydrographicBasinIndexes[hydrographicBasinIndexes.length - 1]
        ];

      const hydrographicBasinTitle = lastHydrographicBasin?.title;

      // "random" key
      let basinKey = hydrographicBasinTitle;
      let currentBasinFilter = [lastHydrographicBasin];

      if (!basinKey) {
        // await dispatch("FETCH_PLACES_OPTIONS");

        // random key
        basinKey = Object.keys(currentReportData)[0];
        currentBasinFilter = [
          state.hydrographicBasinOptions.find((b) => b.title === basinKey),
        ];
      }

      commit("SET_CURRENT_BASIN_NAME", currentBasinFilter);
    },
    async ["FETCH_REPORT_RESOURCES"]({ state, commit, dispatch }, filters) {
      try {
        const showingDataFormat = filters.showingDataFormat.value;
        const showingDataFormatUrl = dataFormatUrl[showingDataFormat];

        const responses = await Promise.all([
          await http.get(`/census/captation/tank/${showingDataFormatUrl}`),
          await http.get(`/census/aquaculture/${showingDataFormatUrl}`),
        ]);

        if (!state.reportsDataAll.hydroResourcesAll) {
          commit("SET_REPORTS_DATA_ALL", {
            hydricResources: mockedHydricResources,
          });
        }

        const hydricResourcesRaw = state.reportsDataAll.hydricResources;

        await dispatch("FETCH_SINGLE_BASIN", {
          ...filters,
          currentReportData: hydricResourcesRaw,
        });

        // "random" key
        let basinKey = state.currentBasinFilter[0].title;

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
          animals:
            showingDataFormat === 3
              ? animals
              : ungroupData(animals, showingDataFormatUrl),
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
          await dispatch("FETCH_REPORT_CULTURE_INDICATORS", filters);
        } else if (groupmentParam === 6) {
          await dispatch("FETCH_REPORT_RESOURCES", filters);
        }
      } catch (e) {
        console.error(e);
      } finally {
        commit("SET_LOADING_REPORT", false);
      }
    },
    async ["FETCH_PLACES_OPTIONS"]({ commit }) {
      try {
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
  },
  getters: {
    cityOptions(state) {
      return state.currentBasinFilter;
    },
    basinOptions: (state) =>
      state.hydrographicBasinOptions.map((b) => ({
        title: b.title,
        value: b.value,
      })),
  },
};
