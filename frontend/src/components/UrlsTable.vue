<template>
  <div class="wrapper-table">
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">
            {{ urls[0]?.accessed_times ? "Acessos" : "Ordem" }}
          </th>
          <th scope="col">Nome</th>
          <th scope="col">Url completa</th>
          <th scope="col">Url encurtada</th>
          <th scope="col">Ação</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(url, index) in urls" :key="url.url_register_id">
          <th scope="row">{{ url.accessed_times ?? index + 1 }}</th>
          <td>{{ getDomainName(url.url_basic) }}</td>
          <td>
            <a :href="url.url_basic" target="_blank" rel="noopener noreferrer">
              {{ url.url_basic }}
            </a>
          </td>
          <td>
            <router-link :to="`/${url.shortned_param}`">
              <span class="p-1">
                {{ url.shortned_param }}
              </span>
            </router-link>
          </td>
          <td>
            <span
              class="text-danger p-2 delete-clickable"
              @click="() => deleteUrl(url.url_register_id)"
            >
              <font-awesome-icon icon="fa-solid fa-trash" />
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

const props = defineProps({
  urls: Array,
});

import { useStore } from "vuex";

const store = useStore();

const getHostname = (url) => {
  try {
    return new URL(url)?.hostname;
  } catch (e) {
    return url;
  }
};

const getDomainName = (url) => {
  return getHostname(url)
    .replace("www.", "")
    .replace(/.com.br/g, "")
    .replace(/.com/g, "");
};

const deleteUrl = (url_register_id) => {
  return store.dispatch("DELETE_URL", url_register_id);
};
</script>
<style lang="scss" scoped>
td {
  max-width: 100px;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
