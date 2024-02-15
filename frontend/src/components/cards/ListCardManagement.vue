<template>
  <div class="row">
    <!-- v-if="currentItemDelete.length" -->
    <DeleteModal
      v-if="showConfirmModal"
      @close-modal="closeModal"
      :users="currentItemDelete"
      action-text="cultura"
      get-data-key="GET_CULTURES"
      delete-data-key="DELETE_CULTURES"
    />

    <div
      v-for="(item, i) in items"
      :key="getUniqueKey(item)"
      class="col-lg-3 mt-lg-4"
      :class="{ 'mt-4': i }"
    >
      <CardManagement
        v-bind="props"
        :item="item"
        @selected-item="setCurrentDelete"
      />
    </div>

    <div class="ml-3 h5" v-if="!items.length">
      Sem dados a exibir para a busca atual
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, ref } from "vue";
import CardManagement from "./CardManagement.vue";
import managementList from "@/components/cards/props/managementList";
import DeleteModal from "@/components/form/DeleteModal.vue";

import { useStore } from "vuex";
const store = useStore();

const showConfirmModal = ref(false);
const currentItemDelete = ref([]);

const props = defineProps(managementList);

const getUniqueKey = (item) => item.id || item.Id;

const mapedBasins = computed(() => {
  const map = {};

  props.filters.hydrographicBasinTemp.forEach((h) => (map[h.title] = true));

  return map;
});

const setCurrentDelete = (item) => {
  showConfirmModal.value = true;
  currentItemDelete.value = [item];
};

const closeModal = () => {
  showConfirmModal.value = false;
  currentItemDelete.value = [];
};

const cleanStringFilter = (str) => str.split(" ").join("").toLowerCase().trim();

store.dispatch("GET_CULTURES");

const items = computed(() =>
  store.state.culture.list.data
    .filter((c) => {
      if (props.filters.searchFilterTemp) {
        return (
          cleanStringFilter(c.Plant_Name).indexOf(
            cleanStringFilter(props.filters.searchFilterTemp)
          ) > -1
        );
      }

      return c;
    })
    .filter((c) => {
      if (props.filters.hydrographicBasinTemp?.length) {
        return mapedBasins.value[c.Basin];
      }

      return c;
    })
);
</script>
