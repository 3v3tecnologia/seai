<template>
  <form class="row align-items-center d-flex py-3" @submit="handleSubmit">
    <div class="form-group mb-0 col-9 col-lg-11">
      <input
        v-model="url"
        required
        type="text"
        class="form-control"
        placeholder="Encurtar nova url"
      />
    </div>
    <div class="col-3 col-lg-1 pl-0">
      <button
        type="submit"
        class="w-100 d-flex align-items-center justify-content-center btn btn-success"
      >
        <font-awesome-icon icon="fa-solid fa-plus" />
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const url = ref("");

const saveUrl = (urlToSave) => {
  return store
    .dispatch("SAVE_URL", urlToSave.value)
    .then(() => (url.value = ""))
    .catch(console.error);
};
const handleSubmit = (e) => {
  e.preventDefault();

  return saveUrl(url);
};
</script>

<style lang="scss" scoped>
form {
  d-flex input {
    border: 2px solid black;
  }
}
</style>
