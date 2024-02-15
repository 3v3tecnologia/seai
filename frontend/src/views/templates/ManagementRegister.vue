<template>
  <div class="mb-5 pb-lg-5">
    <BasicContentWrapper>
      <FiltersData
        v-model="filtersData"
        :search-filter="searchFilter"
        :filters-checkbox="filtersCheckbox"
        :disabled-submit="isLoadingManagement"
        class="mb-5"
      />

      <div class="w-100 d-flex">
        <router-link
          :to="{ name: 'create-culture' }"
          class="btn btn-success text-white px-4 py-2"
        >
          <span class="mr-lg-2 d-none d-lg-inline-block"> Criar </span>
          <font-awesome-icon class="text-white" icon="fa-solid fa-plus" />
        </router-link>
      </div>
      <ListCardManagement v-bind="props" :filters="filtersData" />
    </BasicContentWrapper>
  </div>
</template>

<script setup>
// import managementFarmCreate from "@/router/props/culture/create";

import { computed, defineProps, ref } from "vue";
import { useStore } from "vuex";
import FiltersData from "@/components/form/FiltersData.vue";
import BasicContentWrapper from "@/components/spacing/BasicContentWrapper.vue";
import ListCardManagement from "@/components/cards/ListCardManagement.vue";
import managementList from "@/components/cards/props/managementList";

const store = useStore();

const props = defineProps(managementList);

const filtersData = ref({});

store.dispatch("FETCH_PLACES_OPTIONS");

const hydrographicBasinOptions = computed(
  () => store.state.report.hydrographicBasinOptions
);

const searchFilter = {
  label: "Buscar nome de cultivar",
  key: "searchFilterTemp",
};

const filtersCheckbox = computed(() => [
  {
    label: "Bacias hidrográficas",
    options: hydrographicBasinOptions.value,
    key: "hydrographicBasinTemp",
  },
]);

const isLoadingManagement = computed(() => false);
</script>
