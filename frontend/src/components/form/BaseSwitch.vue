<template>
  <div>
    <!-- <label class="mr-4 mb-0 font-weight-bold">
      <span class="mr-1"> {{ label }} </span>
    </label> -->
    <!-- <div class="custom-control custom-switch"> -->
    <ToggleButton
      onLabel="Exibindo por cidade"
      offLabel="Exibir por cidade"
      v-model="inputValue"
      class="w-8rem wrapper-base-switch"
    />
    <!-- <input
        v-model="inputValue"
        type="checkbox"
        class="custom-control-input"
        id="customSwitch1"
      /> -->
    <!-- <label class="custom-control-label" for="customSwitch1"></label> -->
    <!-- </div> -->
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import ToggleButton from "primevue/togglebutton";

const props = defineProps({
  label: String,
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const inputValue = ref(true);

watch(inputValue, (val) => {
  emit("update:modelValue", val);
});

const label = ref("Exibir por bacia");
</script>

<style lang="scss" scoped>
.wrapper-base-switch {
  width: 192px;
}
</style>
