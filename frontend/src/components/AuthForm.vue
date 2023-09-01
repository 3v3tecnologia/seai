<!-- eslint-disable prettier/prettier -->
<template>
  <FormWrapper @submit="handleSubmit">
    <template v-slot:content>
      <BaseInut label="Login" v-model="form.login" :input-required="isLogging" placeholder="Seu login" />
      <BaseInut v-if="!isLogging" label="Email" v-model="form.email" input-type="password" placeholder="Seu email">
        <div class="mb-3">
          ou
        </div>
      </BaseInut>
      <BaseInut v-else label="Senha" v-model="form.password" input-type="password" placeholder="Sua senha" />
    </template>

    <template v-slot:buttons>
      <slot />
    </template>
  </FormWrapper>
</template>

<script lang="ts" setup>
import BaseInut from "./BaseInput.vue";
import FormWrapper from "./FormWrapper.vue";
import { defineProps } from "vue";
import { ref } from "vue";
import type { Ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  isLogging: Boolean,
});

const store = useStore();

const form: Ref = ref({
  login: "admin",
  password: "1234567",
});

const handleSubmit = (e) => {
  e.preventDefault();

  const action = props.isLogging ? "LOGIN_USER" : "SEND_EMAIL_CHANGE_PASSWORD";
  store.dispatch(action, form.value).then((r) => {
    if (props.isLogging && !(r instanceof Error) && r) {
      router.push({ path: "/" });
    }
  });
};
</script>
