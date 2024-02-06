<template>
  <div class="mb-5 pb-lg-5">
    <BasicContentWrapper>
      <div class="my-5 mb-lg-4">
        <SubRouting :routes="currentRouteAccess" />
      </div>
      <ListCardManagement />
    </BasicContentWrapper>
  </div>
</template>

<script setup>
import { computed } from "vue";
import BasicContentWrapper from "@/components/spacing/BasicContentWrapper.vue";
import SubRouting from "@/components/navigation/SubRouting.vue";
import ListCardManagement from "@/components/cards/ListCardManagement.vue";

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
