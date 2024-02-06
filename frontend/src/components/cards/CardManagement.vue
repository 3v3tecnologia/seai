<template>
  <div
    class="wrapper-card-management d-flex flex-column align-items-start p-4 h-100"
  >
    <div class="overlay-actions" :style="`${getOverlayStyle(chips[0])}`" />

    <div class="d-flex align-items-center justify-content-between w-100">
      <h5
        class="mb-0"
        v-tooltip="{
          value: item.Plant_Name,
          showDelay: 1000,
          hideDelay: 300,
        }"
      >
        {{ item.Plant_Name }}
      </h5>

      <span
        class="card-chip"
        v-for="chip in chips"
        :key="chip.key"
        :style="getChipStyle(chip)"
        v-tooltip="{
          value: item[chip.key],
          showDelay: 1000,
          hideDelay: 300,
        }"
      >
        {{ item[chip.key] }}
      </span>
    </div>

    <div class="my-3" />

    <div class="card-fields d-flex flex-column align-items-start w-100">
      <div
        v-for="(field, i) in fields"
        :key="field.label"
        :class="{ 'mt-1': i }"
        class="card-field w-100 d-flex justify-content-between align-items-center"
      >
        <span class="label text-left"> {{ field.label }}: </span>

        <span class="key">
          {{ item[field.key] }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import propsManagement from "@/components/cards/props/managementCards";

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  ...propsManagement,
});

const toCharAt = (string) => string.charCodeAt();

const getHueChipAdded = (string) =>
  string
    .split(" ")[0]
    .split("")
    .map(toCharAt)
    .reduce((a, b) => a + b);

const getChipStyle = (chip) => {
  const hue = getHueChipAdded(props.item[chip.key]);

  const hslValue = "hsl(" + hue + ",80.9%,40.02%)";

  return `background-color: ${hslValue}`;
};

const getOverlayStyle = (chip) => {
  if (!chip) {
    return;
  }

  const hue = getHueChipAdded(props.item[chip.key]);

  const hslValue = "hsl(" + hue + ",80.9%,39.02%, 0.35)";

  return (
    "background: linear-gradient(0deg, " +
    hslValue +
    ", rgb(101 101 108 / 0%) 80%) no-repeat;"
  );
};
</script>

<style lang="scss" scoped>
.wrapper-card-management {
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  min-height: 150px;
  background: #ffffffba;
  border-radius: 5px 25px 5px 25px;
  border: 1px solid #0000001f;

  position: relative;

  overflow: hidden;

  &,
  &:hover {
    .overlay-actions {
      transition: all 0.3s;
    }
  }

  &:hover {
    .overlay-actions {
      opacity: 1;
      pointer-events: all;
    }
  }

  .overlay-actions {
    opacity: 0;
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 50%;

    bottom: 0;
    left: 0;
  }

  & h5 {
    max-width: calc(60% - 2rem);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    letter-spacing: 0.1rem;
    font-family: "Secular One", sans-serif !important;
    font-size: 1.3rem;
    text-align: start;
  }

  & .card-chip {
    max-width: 40%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    padding: 0.5rem;
    border-radius: 10px;
    color: white;
    font-size: 0.8rem;
  }

  & .card-fields {
    color: gray;

    .card-field {
      border-bottom: 1px solid #00000014;

      & .label {
        font-size: 0.95rem;
      }
    }

    & .key {
      color: var(--text-color) !important;
    }
  }
}
</style>
