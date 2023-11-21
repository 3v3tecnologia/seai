<template>
  <BasicContentWrapper>
    <div
      v-if="headerLabels.length"
      class="users-count d-flex align-items-center justify-content-between p-lg-5 mb-5"
    >
      <div
        class="wrapper-counter"
        v-for="counter in headerLabels"
        :key="counter.title"
      >
        <div class="counter">
          {{ data?.[counter.key] }}
        </div>
        <div class="label">
          {{ counter.title }}
        </div>
      </div>
    </div>

    <CrudTable
      v-model="filtersUsers"
      :hide-search="hideSearch"
      :action-text="actionText"
      :show-date-range-filter="showDateRangeFilter"
      :has-api-filters="hasApiFilters"
      :data="data.data"
      :store-data-key="storeDataKey"
      :columns="columns"
      :filters="filters"
      :state-filters="stateFilters"
      :search-filter="searchFilter"
      :action-routes="actionRoutes"
      :get-data-key="getDataKey"
      :delete-data-key="deleteDataKey"
    />
  </BasicContentWrapper>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import CrudTable from "@/components/CrudTable.vue";
import BasicContentWrapper from "@/components/BasicContentWrapper.vue";
import { computed, ref, defineProps, watch } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  headerLabels: {
    type: Array,
    required: true,
  },
  actionText: {
    type: String,
    required: true,
  },
  hasApiFilters: {
    type: Boolean,
    default: false,
  },
  stateFilters: {
    type: Array,
    default: () => [],
  },
  hideSearch: {
    type: Boolean,
    default: false,
  },
  showDateRangeFilter: {
    type: Boolean,
    default: false,
  },
  storeDataKey: {
    type: String,
    required: true,
  },
  getDataKey: {
    type: String,
    required: true,
  },
  deleteDataKey: {
    type: String,
    required: true,
  },
  columns: {
    type: Array,
    default: () => [],
  },
  actionRoutes: {
    type: Object,
    required: true,
  },
  filters: {
    type: Array,
    required: false,
    default: () => [],
  },
  searchFilter: {
    type: Array,
    required: true,
  },
});

// const currentRoute = useRoute();
// const paramId = computed(() => currentRoute.params.id || "");
const store = useStore();
const filtersUsers = ref({});

// const getData = async () => {
//   return await store.dispatch(props.getDataKey, {
//     id: paramId.value,
//   });
// };

// watch(
//   () => props.getDataKey,
//   async (newVal) => {
//     await getData();
//   },
//   { immediate: true }
// );

// getData();

const data = computed(() => store.state[props.storeDataKey]);
</script>

<style lang="scss" scoped>
.users-count {
  background: rgba(203, 197, 197, 0.529);
  border-radius: 5px;
  border: 1px solid black;
  max-width: 800px !important;
  margin: auto;

  .wrapper-counter {
    display: flex;
    flex-direction: column;
    color: black;

    .counter {
      font-weight: bold;
      font-size: 2rem;
    }

    .label {
      font-size: 1.1rem;
    }
  }
}
</style>
