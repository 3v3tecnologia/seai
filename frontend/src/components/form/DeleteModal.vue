<template>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Confirmar deleção</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="props.users.length === 1">
            Será deletado/a <span class="font-weight-bold">1</span>
            {{ actionText }}
            selecionado/a.
          </div>
          <div v-else>
            Serão deletados/as
            <span class="font-weight-bold">{{ props.users.length }}</span>
            {{ actionText }}s selecionados/as.
          </div>
          <div>Este processo não poderá ser desfeito.</div>
        </div>

        <div class="modal-footer">
          <button
            @click="cancelDelete"
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-danger"
            data-dismiss="modal"
            @click="deleteUsers"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";
import { useStore } from "vuex";

const store = useStore();

const props = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
  getDataKey: {
    type: String,
    required: true,
  },
  deleteDataKey: {
    type: String,
    required: true,
  },
  actionText: {
    type: String,
    required: true,
  },
  users: {
    type: Array,
    default: () => [],
  },
});

const usersIds = computed(() => props.users.map((u) => u.id || u.Id));

const deleteUsers = async () => {
  await store.dispatch(props.deleteDataKey, usersIds.value);
  await store.dispatch(props.getDataKey, usersIds.value);
};

const emit = defineEmits(["close-modal"]);

const cancelDelete = () => emit("close-modal");
</script>
