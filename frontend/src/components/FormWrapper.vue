<template>
  <div class="wrapper-form">
    <form @submit="handleSubmit" class="text-left p-4 p-lg-5">
      <slot name="content" />

      <div class="pt-3">
        <slot name="buttons" />
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits } from "vue";

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
    max-width: 500px;
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
