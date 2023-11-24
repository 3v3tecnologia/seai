<template>
  <div class="home">
    <FormWrapper :title="headerLabel" @submit="handleSubmit">
      <template v-slot:content>
        <div class="py-2 mb-3"></div>

        <div class="row align-items-end">
          <div
            class="col-lg-6"
            v-for="field in prebuiltComponentsFields"
            :key="field.formKey"
          >
            <!-- v-model="form[field.formKey]" -->
            <component
              v-model="form[field.formKey]"
              v-bind="field.component.props"
              :is="preBuiltComponents[field.component.name]"
            />
          </div>

          <div
            class="col-lg-3"
            v-for="field in drodpDowns"
            :key="field.formKey"
          >
            <BaseDropdown
              v-model="form[field.formKey]"
              inline-label
              remove-margin
              class="w-100"
              width="100%"
              :options="field.options"
              :placeholder="field.label"
            />
          </div>

          <div
            v-for="(field, i) in inputFields"
            :key="field.formKey"
            :class="`${
              !inputFields.length % 0 && i === inputFields.length - 1
                ? 'col-lg-12'
                : 'col-lg-6'
            }`"
          >
            <span
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
              <InputNumber
                v-if="field.type === 'number'"
                v-model="form[field.formKey]"
                :required="!field.nullable"
                :input-id="field.formKey"
                class="w-100"
                :maxFractionDigits="5"
                locale="en-US"
                showButtons
                :class="{
                  'p-invalid': [null, undefined, ''].includes(
                    form[field.formKey]
                  ),
                }"
              />
              <InputText
                v-else
                v-model="form[field.formKey]"
                :required="!field.nullable"
                type="text"
                :input-id="field.formKey"
                :minlength="requireMinMax ? 5 : null"
                :maxlength="requireMinMax ? 25 : null"
                class="w-100"
              />

              <label class="font-weight-bold" :for="field.formKey"
                >{{ field.label }}
              </label>
            </span>
          </div>
        </div>

        <div class="py-2"></div>
      </template>

      <template v-slot:buttons>
        <router-link
          v-if="
            hasSaved || (finishedDataButton && finishedDataButton.isRedirect)
          "
          :to="{
            name: finishedDataButton.routeName,
            params: {
              id:
                form?.[fields?.[finishedDataButton?.fieldIdIndex]?.formKey]
                  ?.id || 1,
            },
          }"
          class="btn btn-success px-4 py-2 btn-block"
        >
          {{ finishedDataButton.text }}
        </router-link>

        <PrimaryButton
          v-else
          :disabled="!changedForm && !isNewForm"
          :text="`${isNewForm ? 'Salvar dados' : 'Atualizar dados'}`"
        />
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
import InputNumber from "primevue/inputnumber";
import { useRoute } from "vue-router";
import BaseDropdown from "@/components/BaseDropdown.vue";
import FilterDate from "@/components/FilterDate.vue";

const preBuiltComponents = {
  FilterDate,
};

const currentRoute = useRoute();
const fieldsTmp = ref([]);
const hasSaved = ref(false);

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
  requireMinMax: {
    type: Boolean,
    default: false,
  },
  submitDataKey: {
    type: String,
    required: true,
  },
  headerLabel: {
    type: String,
    required: true,
  },
  finishedDataButton: {
    type: Object,
    required: true,
  },
  fields: {
    type: Array,
    required: true,
  },
  navBarTab: {
    type: Number,
    default: null,
  },
});

watch(
  () => props.navBarTab,
  (val) => {
    if (val || val === 0) {
      store.commit("SET_CURRENT_TAB", val);
    }
  },
  { immediate: true }
);

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

const inputFields = computed(() =>
  fieldsTmp.value.filter((f) => !f.getListKey && !f.component)
);

const prebuiltComponentsFields = computed(() =>
  fieldsTmp.value
    .filter((f) => f.component)
    .map((field) => {
      field.value = form.value[field.formKey];
      return field;
    })
);

const drodpDowns = computed(() =>
  fieldsTmp.value
    .filter((f) => f.getListKey && !f.component)
    .map((field) => {
      field.value = form.value[field.formKey];
      field.options = store.getters[field.getterKey].filter((f) => f.value);

      return field;
    })
);

const form = ref({});
const oldForm = ref({});

const updateDropdownsValue = () => {
  drodpDowns.value.forEach((field) => {
    const matchedResult = field.options.find((f) => f.title === field.value);

    const valueWasEmpty = !form.value[field.formKey];

    if (valueWasEmpty) {
      form.value[field.formKey] = field.options[0];
    } else if (matchedResult) {
      form.value[field.formKey] = matchedResult;
    }
  });
};

watch(drodpDowns.value, updateDropdownsValue, { immediate: true, deep: true });

const getConcatValuesForms = (formToCheck) => {
  return Object.values(formToCheck)
    .map((field) => field?.title ?? field)
    .join("");
};

const changedForm = computed(() => {
  const hasOldVal = Object.keys(oldForm.value).length;
  const concatOldVal = getConcatValuesForms(oldForm.value);
  const concatNewVal = getConcatValuesForms(form.value);

  return hasOldVal && concatOldVal !== concatNewVal;
});

const isNewForm = computed(() => {
  return !Object.keys(oldForm.value).length;
});

const setFormWatcher = () => {
  form.value = {
    ...formData.value,
  };

  oldForm.value = {
    ...formData.value,
  };
};

const updateOldForm = (hasSavedForm = false) => {
  oldForm.value = {
    ...form.value,
  };

  hasSaved.value = !!hasSavedForm;
};

watch(formData, () => {
  setFormWatcher();
});

watch(
  () => currentRoute.name,
  () => {
    form.value = {};
    updateOldForm();
    updateDropdownsValue();
  },
  {
    deep: true,
  }
);

const handleSubmit = async (e) => {
  e.preventDefault();

  await store
    .dispatch(props.submitDataKey, form.value)
    .then(() => {
      updateOldForm(true);
    })
    .catch(console.error);
};
</script>

<style>
.margin-inputs {
  margin-top: 2rem;
}
</style>
