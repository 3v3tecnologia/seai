<template>
  <div class="home">
    <FormWrapper :title="headerLabel" @submit="handleSubmit">
      <template v-slot:content>
        <div class="py-2"></div>

        <br />
        <br />
        <BaseDropdown
          v-model="form[field.formKey]"
          class="mt-3"
          v-for="field in drodpDowns"
          :key="field.formKey"
          inline-label
          remove-margin
          :options="field.options"
          :placeholder="field.label"
        />

        <span
          v-for="(field, i) in fieldsTmp.filter((f) => !f.getListKey)"
          :key="field.formKey"
          class="margin-inputs d-block p-input-icon-right p-float-label"
          :class="{
            'mb-4': i === fields.length - 1,
          }"
        >
          <i
            v-if="field.type === 'password'"
            @click="() => clickEyePassword(field)"
            :class="`pi ${field.tmp_pass ? 'pi-eye-slash' : 'pi-eye'}`"
          />
          <InputText
            :minlength="field.nullable ? 0 : 5"
            maxlength="25"
            v-model="form[field.formKey]"
            :type="field.type && field.tmp_pass ? field.type : 'text'"
            class="w-100"
            :input-id="field.formKey"
          />

          <label class="font-weight-bold" :for="field.formKey"
            >{{ field.label }}
          </label>
        </span>

        <div class="py-2"></div>
      </template>

      <template v-slot:buttons>
        <PrimaryButton :disabled="!changedForm" text="Atualizar dados" />
      </template>
    </FormWrapper>

    <div class="py-5"></div>
  </div>
</template>

<script setup>
import PrimaryButton from "@/components/PrimaryButton.vue";
import FormWrapper from "@/components/FormWrapper.vue";
import { computed, ref, watch, defineProps } from "vue";
import { useStore } from "vuex";
import InputText from "primevue/inputtext";
import { useRoute } from "vue-router";
import BaseDropdown from "@/components/BaseDropdown.vue";

const currentRoute = useRoute();
const fieldsTmp = ref([]);

const paramId = ref(currentRoute.params.id || "");

const store = useStore();

const clickEyePassword = (field) => {
  field.tmp_pass = !field.tmp_pass;
};

const props = defineProps({
  getDataKey: {
    type: String,
    required: true,
  },
  storeDataKey: {
    type: String,
    required: true,
  },
  submitDataKey: {
    type: String,
    required: true,
  },
  headerLabel: {
    type: String,
    required: true,
  },
  fields: {
    type: Array,
    required: true,
  },
});

watch(
  currentRoute,
  (newVal) => {
    paramId.value = newVal.params.id;

    if (props.getDataKey) {
      store.dispatch(props.getDataKey, paramId.value);
    }
  },
  { immediate: true }
);

watch(
  () => props.fields,
  async (newVal) => {
    fieldsTmp.value = newVal
      .map((c) => ({ ...c }))
      .map((c) => {
        c.tmp_pass = true;

        return c;
      });

    await Promise.allSettled(
      fieldsTmp.value
        .filter((f) => f.getListKey)
        .map(async (f) => await store.dispatch(f.getListKey))
    );
  },
  { immediate: true, deep: true }
);

const formData = computed(() =>
  props.storeDataKey ? store.state[props.storeDataKey] : {}
);

const drodpDowns = computed(() =>
  fieldsTmp.value
    .filter((f) => f.getListKey)
    .map((field) => {
      field.value = form.value[field.formKey];
      field.options = store.getters[field.getterKey].filter((f) => f.value);

      return field;
    })
);

const form = ref({});
const oldForm = ref({});

watch(
  drodpDowns.value,
  (newVal) => {
    newVal.forEach((field) => {
      const matchedResult = field.options.find((f) => f.title === field.value);

      const valueWasEmpty = !form.value[field.formKey];

      if (valueWasEmpty) {
        form.value[field.formKey] = field.options[0];
      } else if (matchedResult) {
        form.value[field.formKey] = matchedResult;
      }
    });
  },
  { immediate: true, deep: true }
);

const getConcatValuesForms = (formToCheck) => {
  return Object.values(formToCheck).join("");
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

watch(formData, (newVal) => {
  form.value = {
    ...newVal,
  };

  oldForm.value = {
    ...newVal,
  };
});

const handleSubmit = async (e) => {
  e.preventDefault();

  await store.dispatch(props.submitDataKey, form.value).catch(console.error);
};
</script>

<style>
.margin-inputs {
  margin-top: 2rem;
}
</style>
