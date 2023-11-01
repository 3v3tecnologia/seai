<template>
  <div
    class="base-pagination d-flex align-items-center justify-content-between px-2"
  >
    <div>
      Mostrando {{ currentShowingItems }} de {{ totalItems }}
      {{ loweredCollectionText }}s
    </div>
    <div>
      <!-- <div class="font-weight-bold">
        {{ capitalizedCollectionText }}s Por Página: {{ perPage }}
      </div> -->
      <div class="navigation-items">
        <button>Primeira</button>
        <button>Anterior</button>
        <button>Próxima</button>
        <button>Última</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    default: 0,
  },
  totalItems: {
    type: Number,
    default: 50,
  },
  currentShowingItems: {
    type: Number,
    default: 30,
  },
  collectionText: {
    type: String,
    default: "Usuário",
  },
  perPage: {
    type: Number,
    default: 50,
  },
});

const capitalizedCollectionText = computed(
  () =>
    props.collectionText[0].toUpperCase() +
    props.collectionText.substring(1).toLowerCase()
);

const loweredCollectionText = computed(() =>
  props.collectionText.toLowerCase()
);
</script>

<style>
.base-pagination {
  height: 57px;
  background-color: #e6e6e6;
  border: 1px solid rgba(75, 75, 75, 0.3490196078);
  border-radius: 5px;
  border-radius: 0 0 5px 5px;
}

.navigation-items > * {
  border-color: #dee2e6;
  background: #e9ecef;
  color: #0056b3;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  background: hsla(0, 0%, 100%, 0.2);
}
</style>
