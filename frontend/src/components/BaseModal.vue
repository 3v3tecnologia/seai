<template>
  <!-- Button trigger modal -->
  <!-- <button
    type="button"
    class="btn btn-primary"
    data-toggle="modal"
    data-target="#exampleModal"
  >
    Launch demo modal
  </button> -->

  <!-- Modal -->
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
            Será deletado <span class="font-weight-bold">1</span> usuário
            selecionado.
          </div>
          <div v-else>
            Serão deletados
            <span class="font-weight-bold">{{ props.users.length }}</span>
            usuários selecionados.
          </div>
          <div>Este processo não poderá ser desfeito.</div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">
            Cancelar
          </button>
          <button type="button" class="btn btn-danger">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, watch } from "vue";

const props = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
  users: {
    type: Array,
    default: () => [],
  },
});
</script>
