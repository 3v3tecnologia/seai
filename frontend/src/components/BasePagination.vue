<template>
  <div
    class="base-pagination d-flex flex-column flex-lg-row align-items-center justify-content-between px-2 py-2 w-100"
  >
    <div class="ml-lg-4 my-3">
      <span v-if="currentShowingItems.length || isLoading">
        Exibindo {{ currentShowingItems.length }} de {{ totalItems }}
        {{ loweredCollectionText }}s
      </span>
      <span v-else class="font-weight-bold">
        <i class="pi pi-exclamation-circle" />
        <font-awesome-icon icon="" />

        Não existem dados correspondentes a esta busca
      </span>
    </div>
    <div class="mb-1">
      <div class="navigation-items">
        <button class="bg-white p-2" @click="setFirstPage">Primeira</button>
        <button class="bg-white p-2 mx-2" @click="setBeforePage">
          Anterior
        </button>
        <button
          v-for="page in pagesShowing"
          :key="page"
          class="btn-page p-2"
          :class="{
            'is-current': currentPage === page,
          }"
          @click="setPage(page)"
        >
          {{ page }}
        </button>
        <button class="bg-white p-2 mx-2" @click="setNextPage">Próxima</button>
        <button class="bg-white p-2" @click="setLastPage">Última</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  modelValue: Number,
  apiPagination: {
    type: Object,
    required: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  totalItems: {
    type: Number,
    default: 1,
  },
  currentShowingItems: {
    type: Array,
    default: () => [],
  },
  collectionText: {
    type: String,
    default: "",
  },
  perPage: {
    type: Number,
    default: 1,
  },
});

const pagesButtonsMax = 5;

const totalPages = computed(() => {
  const basePagination = props.apiPagination
    ? props.apiPagination.pages
    : Math.ceil(props.totalItems / props.perPage);

  return basePagination || 1;
});

const isOutOfBoundsPagination = computed(
  () => currentPage.value > pagesShowing.value.length
);

const currentPage = ref(1);
const pages = computed(() =>
  [...Array(totalPages.value).keys()].map((c) => c + 1)
);

const pagesShowing = computed(() =>
  pages.value.filter((page) => {
    let finalPage = currentPage.value + pagesButtonsMax - 1;
    let leftPagesGap = -(finalPage - pages.value.length);
    let initialPage = leftPagesGap + currentPage.value;

    if (leftPagesGap > 0) {
      leftPagesGap = 0;
    }

    initialPage = leftPagesGap + currentPage.value;
    finalPage = initialPage + pagesButtonsMax - 1;

    return page >= initialPage && page <= finalPage;
  })
);

const loweredCollectionText = computed(() =>
  props.collectionText.toLowerCase()
);

const emit = defineEmits(["update:modelValue"]);

const setPage = (page) => {
  const lastPage = pages.value[pages.value.length - 1];
  const firstPage = pages.value[0];
  let pageToSet = null;

  if (page > lastPage) {
    pageToSet = lastPage;
  } else if (page < firstPage) {
    pageToSet = firstPage;
  } else {
    pageToSet = page;
  }

  emit("update:modelValue", pageToSet);
  currentPage.value = pageToSet;
};

const setFirstPage = () => {
  setPage(pages.value[0]);
};

const setLastPage = () => {
  setPage(pages.value[pages.value.length - 1]);
};

const setBeforePage = () => {
  setPage(currentPage.value - 1);
};

const setNextPage = () => {
  setPage(currentPage.value + 1);
};

watch(
  () => props.modelValue,
  (val) => {
    setPage(val);
  }
);

watch(
  () => isOutOfBoundsPagination.value,
  (val) => {
    if (val) {
      setPage(pagesShowing.value[pagesShowing.value.length - 1]);
    }
  }
);
</script>

<style lang="scss" scoped>
.base-pagination {
  @media (min-width: 992px) {
    height: 57px;
  }

  background-color: #e6e6e6;
  border: 1px solid rgba(75, 75, 75, 0.3490196078);
  border-radius: 5px;
  border-radius: 0 0 5px 5px;
}

.navigation-items > * {
  $filter-hover: brightness(0.8);
  $active-bg: #007bff;
  $active-color: white;

  border-color: #dee2e6;
  background: #e9ecef;
  color: #0056b3;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  background: hsla(0, 0%, 100%, 0.2);
  border-radius: 5px;

  &:hover,
  &.is-current {
    background-color: $active-bg !important;
    color: $active-color !important;
  }

  &:not(.btn-page) {
    width: 77px;
  }

  &.btn-page {
    width: 45px;
    transition: all 0.3s;

    &.is-current {
      &:hover {
        filter: $filter-hover;
      }
    }
  }
}
</style>
