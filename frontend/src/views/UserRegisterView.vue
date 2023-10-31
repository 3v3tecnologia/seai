<template>
  <div class="mb-5 pb-5">
    <FormWrapper :title="formTitle" @submit="handleSubmit">
      <template v-slot:content>
        <div class="py-2"></div>
        <BaseInput
          label="Email"
          v-model="form.email"
          placeholder="Insira um email"
          input-required
          input-type="email"
          :disabled="!isCreating"
        />

        <div class="py-2" />

        <BaseDropdown
          label="Tipo de usuário"
          v-model="form.type"
          placeholder="Tipo de usuário"
          :options="optionsUser"
          input-required
          input-type="password"
        />

        <div class="py-3" />

        <AccessModulesTable :user-type="form.type" v-model="acessData" />
      </template>

      <template v-slot:buttons>
        <PrimaryButton
          :text="`${
            savedAccount ? 'Voltar ao listamento de usuários' : 'Salvar usuário'
          }`"
        />
      </template>
    </FormWrapper>
  </div>
</template>

<script setup>
import AccessModulesTable from "@/components/AccessModulesTable.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseDropdown from "@/components/BaseDropdown.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import FormWrapper from "@/components/FormWrapper.vue";
import { computed, watch } from "vue";
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";

const router = useRouter();
const currentRoute = useRoute();
const store = useStore();

const optionsUser = [
  { title: "Básico", value: 0 },
  { title: "Admin", value: 1 },
];

const acessData = ref({});

const form = ref({
  type: optionsUser[0],
});
const savedAccount = ref(false);
const token = ref(currentRoute.query.token || "");

const isCreating = computed(() => {
  return currentRoute.name === "create-user";
});
const currentUser = computed(() => store.state.currentUser);

const userId = ref(currentRoute.params.id || "");

watch(
  () => isCreating.value,
  async (val) => {
    if (!val) {
      await store.dispatch("GET_CURRENT_USER", userId.value);

      if (currentUser.value) {
        acessData.value = currentUser.value.modules;
        form.value.email = currentUser.value.email;
        form.value.name = currentUser.value.name;
        form.value.login = currentUser.value.login;
        form.value.type =
          currentUser.value.type === "admin" ? optionsUser[1] : optionsUser[0];
      }
    }
  },
  { immediate: true }
);

const formTitle = computed(() => {
  return isCreating.value
    ? "Cadastrando usuário"
    : "Editando permissões de usuário";
});

const formDTO = computed(() => {
  return {
    ...form.value,
    type: form.value.type.value ? "admin" : "standard",
    modules: acessData.value,
  };
});

const handleSubmit = async (e) => {
  try {
    e.preventDefault();

    const { email, type } = form.value;
    const hasEmptyForm = [email, type].filter((val) => !val).length;

    if (hasEmptyForm) {
      return toast.warn("Preencha todos os campos.");
    }

    if (savedAccount.value) {
      return router.push({ name: "users" });
    }

    if (isCreating.value) {
      await store
        .dispatch("CREATE_USER", formDTO.value)
        .then(() => {
          savedAccount.value = true;
        })
        .catch(console.error);
    } else {
      await store
        .dispatch("UPDATE_USER", formDTO.value)
        .then(() => {
          savedAccount.value = true;
        })
        .catch(console.error);
    }
  } catch (e) {
    console.error("erro no salve", e);
  }
};
</script>
