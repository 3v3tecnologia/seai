<template>
  <div class="mb-5 pb-lg-5">
    <BasicContentWrapper>
      <div class="my-5 mb-lg-4">
        <SubRouting :routes="currentRouteAccess" />
      </div>
      <ListCardManagement v-bind="props" />
    </BasicContentWrapper>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";
import BasicContentWrapper from "@/components/spacing/BasicContentWrapper.vue";
import SubRouting from "@/components/navigation/SubRouting.vue";
import ListCardManagement from "@/components/cards/ListCardManagement.vue";
import managementList from "@/components/cards/props/managementList";

const props = defineProps(managementList);

const currentRouteAccess = computed(() => [
  {
    label: "Culturas",
    name: "culture",
  },
  {
    label: "Solos",
    name: "soil",
  },
]);
</script>
