<template>
  <div class="home">
    <FormWrapper :title="headerLabel" @submit="handleSubmit">
      <template v-slot:content>
        <div class="row">
          <div
            v-for="(field, i) in fieldsTotal"
            :class="field.colSize ? `col-lg-${field.colSize}` : 'col-lg-6'"
            class="align-items-end d-flex"
            :key="i"
          >
            <component
              v-if="field._typeComponent == 'component'"
              v-model="form[field.formKey]"
              v-bind="field.component.props"
              :is="preBuiltComponents[field.component.name]"
            />

            <BaseDropdown
              v-else-if="field._typeComponent == 'dropdown'"
              v-model="form[field.formKey]"
              inline-label
              remove-margin
              class="w-100"
              :class="{ 'mt-5': i > 1 }"
              width="100%"
              :options="field.options"
              :placeholder="field.label"
            />

            <span
              v-else
              class="margin-inputs d-block p-input-icon-right p-float-label"
            >
              <i
                v-if="field.type === 'password' || field.subtype === 'password'"
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
                :disabled="field.disabled"
                :required="!field.nullable"
                :type="field.type || 'text'"
                :input-id="field.formKey"
                :minlength="
                  field.requireMinMax || field.min ? field.min || 5 : null
                "
                :maxlength="
                  field.requireMinMax || field.max ? field.max || 25 : null
                "
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
import PrimaryButton from "@/components/form/PrimaryButton.vue";
import FormWrapper from "@/components/form/FormWrapper.vue";
import { computed, ref, watch, defineProps } from "vue";
import { useStore } from "vuex";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import { useRoute } from "vue-router";
import BaseDropdown from "@/components/form/BaseDropdown.vue";
import FilterDate from "@/components/form/FilterDate.vue";
import FarmDap from "@/components/form/FarmDap.vue";
import FieldEditor from "@/components/form/FieldEditor.vue";
import { accessStoreKey } from "@/helpers/dto";

const preBuiltComponents = {
  FilterDate,
  FieldEditor,
  FarmDap,
};

const currentRoute = useRoute();
const fieldsTmp = ref([]);
const hasSaved = ref(false);

const paramId = ref(currentRoute.params.id || "");

const store = useStore();

const clickEyePassword = (field) => {
  field.tmp_pass = !field.tmp_pass;
  field.subtype = "password";
  field.type = field.type === "password" ? "text" : "password";
};

const props = defineProps({
  getDataKey: {
    type: String,
    required: true,
  },
  storeDataKey: {
    type: [String, Array],
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
  finishedDataButton: {
    type: Object,
    required: true,
  },
  defaultValue: {
    type: [Object, Boolean],
    required: false,
    default: false,
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
      .map((c, index) => {
        c.index = index;
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

const formData = computed(() => {
  let data = {};

  if (props.defaultValue) {
    data = props.defaultValue;
  } else if (props.storeDataKey) {
    data = accessStoreKey(store.state, props.storeDataKey);
  } else {
    data = {};
  }

  return data;
});

const labelTypeField = (fields, type) =>
  fields.map((field) => {
    field._typeComponent = type;
    return field;
  });

const fieldsTotal = computed(() => {
  const tempComponents = labelTypeField(
    prebuiltComponentsFields.value,
    "component"
  );
  const tempDropdowns = labelTypeField(drodpDowns.value, "dropdown");
  const tempInputFields = labelTypeField(inputFields.value, "input");

  return [...tempComponents, ...tempDropdowns, ...tempInputFields].sort(
    (a, b) => a.index - b.index
  );
});

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
  const flatTypes = ["string", "number"];
  const isFlat = (field) => flatTypes.includes(typeof field);

  return Object.values(formToCheck)
    .map((field) => {
      if (isFlat(field)) {
        return field;
      }

      let currentField = field;

      if (!currentField.length) {
        currentField = [currentField];
      }

      return currentField.map((row) => Object.values(row).join("")).join("");
    })
    .join("");
};

const changedForm = computed(() => {
  const hasOldVal = Object.keys(oldForm.value).length;
  const concatOldVal = getConcatValuesForms(oldForm.value);
  const concatNewVal = getConcatValuesForms(form.value);

  return hasOldVal && concatOldVal !== concatNewVal;
});

const isNewForm = computed(() => {
  return !Object.keys(oldForm.value).length || props.defaultValue;
});

const setFormWatcher = () => {
  form.value = JSON.parse(JSON.stringify(formData.value));

  oldForm.value = JSON.parse(JSON.stringify(formData.value));
};

const updateOldForm = (hasSavedForm = false) => {
  oldForm.value = JSON.parse(JSON.stringify(form.value));

  hasSaved.value = !!hasSavedForm;
};

watch(
  formData,
  () => {
    setFormWatcher();
  },
  { immediate: true, deep: true }
);

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

.row > * > * {
  width: 100%;
}
</style>
