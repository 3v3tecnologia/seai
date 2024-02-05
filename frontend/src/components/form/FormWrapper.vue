<template>
  <div class="px-4">
    <div class="wrapper-form">
      <form @submit="handleSubmit" class="text-left p-4 p-lg-5">
        <h2>{{ props.title }}</h2>

        <slot name="content" />

        <div class="pt-3">
          <slot name="buttons" />
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from "vue";

const props = defineProps({ title: String });
const emit = defineEmits(["submit"]);

const handleSubmit = (e) => {
  emit("submit", e);
};
</script>

<style lang="scss" scoped>
.wrapper-form {
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;

  @media (min-width: 992px) {
    max-width: 900px;
    margin: 0 auto;
  }

  form {
    background: $base-blue;

    label {
      font-weight: bold;
    }
  }
}
</style>
