<template>
  <div class="home">
    <FormWrapper title="Atualizar dados perfil" @submit="handleSubmit">
      <template v-slot:content>
        <div class="py-2"></div>
        <BaseInput
          label="Login"
          v-model="form.login"
          placeholder="Login"
          input-type="text"
          input-required
          :min-length="minLengthInputs"
        />

        <BaseInput
          label="Nome"
          v-model="form.name"
          placeholder="Nome"
          input-type="text"
          input-required
          :min-length="minLengthInputs"
        />

        <BaseInput
          label="email"
          v-model="form.email"
          placeholder="email"
          input-type="email"
          input-required
          :min-length="minLengthInputs"
        />
      </template>
      <template v-slot:buttons>
        <PrimaryButton :disabled="!changedForm" text="Atualizar dados" />
      </template>
    </FormWrapper>

    <div class="py-5"></div>
  </div>
</template>

<script setup>
import LogoProject from "@/components/LogoProject.vue";
import BaseInput from "@/components/BaseInput.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import FormWrapper from "@/components/FormWrapper.vue";
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { validatePasswords } from "@/components/charts/helpers";

const store = useStore();

const minLengthInputs = 5;

store.dispatch("GET_PROFILE");
const profile = computed(() => store.state.profile);

const form = ref({});
const oldForm = ref({});

const getConcatValuesForms = (formToCheck) => {
  const { login, name, email } = formToCheck;

  const tempForm = {
    login,
    name,
    email,
  };

  return Object.values(tempForm).join("");
};

const changedForm = computed(() => {
  const hasOldVal = Object.keys(oldForm.value).length;
  const concatOldVal = getConcatValuesForms(oldForm.value);
  const concatNewVal = getConcatValuesForms(form.value);

  if (hasOldVal && concatOldVal !== concatNewVal) {
    return true;
  }

  return false;
});

watch(profile, (newVal) => {
  form.value = {
    ...newVal,
  };

  oldForm.value = {
    ...newVal,
  };
});

const handleSubmit = async (e) => {
  e.preventDefault();

  // const isValidPassword = validatePasswords(form.value);

  await store.dispatch("UPDATE_PROFILE", form.value).catch(console.error);
};
</script>
