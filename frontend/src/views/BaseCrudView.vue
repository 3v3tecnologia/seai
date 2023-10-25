<template>
  <BasicContentWrapper>
    <div
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
      v-if="data.data.length"
      :action-text="actionText"
      :get-data="getData"
      :data="data.data"
      :store-data-key="storeDataKey"
      :columns="columns"
      :filters="filters"
      :action-routes="actionRoutes"
    />
  </BasicContentWrapper>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import CrudTable from "@/components/CrudTable.vue";
import BasicContentWrapper from "@/components/BasicContentWrapper.vue";
import { computed, ref, defineProps, watch } from "vue";

const props = defineProps({
  headerLabels: {
    type: Array,
    required: true,
  },
  actionText: {
    type: String,
    required: true,
  },
  storeDataKey: {
    type: String,
    required: true,
  },
  getDataKey: {
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
    required: true,
  },
});

const store = useStore();
const filtersUsers = ref({});

const getData = async () => await store.dispatch(props.getDataKey);

watch(
  () => props.getDataKey,
  async (newVal) => {
    await getData();
  },
  { immediate: true }
);

getData();

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
