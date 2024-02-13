<template>
  <div class="mb-5 pb-lg-5">
    <BasicContentWrapper>
      <ListCardManagement v-bind="props" />
    </BasicContentWrapper>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import BasicContentWrapper from "@/components/spacing/BasicContentWrapper.vue";
import ListCardManagement from "@/components/cards/ListCardManagement.vue";
import managementList from "@/components/cards/props/managementList";

const props = defineProps(managementList);
</script>
