<template>
    <form @submit.prevent="onSubmit" class="max-w-md mx-auto">
      <div v-for="(field, index) in formConfig" :key="index" class="mb-4">
        <label :for="field.name" class="block text-gray-600">{{ field.label }}</label>
        <input
          :type="field.type"
          :name="field.name"
          :required="field.required"
          v-model="formData[field.name]"
          class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>
      <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
        Envoyer
      </button>
    </form>
  </template>
  
  
  
  <script setup lang="ts">
  import { ref, defineProps } from 'vue';


  
    const props = defineProps({
        formConfig: {
            type: Array as () => FormFieldConfig[],
            required: true,

        },
        onSubmit: {
            type: Function, 
            required: true,

        },
    });

  const formData = ref<Record<string, any>>({});
  
    interface FormFieldConfig {
        type: string;
        label: string;
        name: string;
        placeholder?: string;
        required: boolean;
        apiOptions?: {
        url: string;
        method: string;
        };
    }
  async function validateFieldWithApi(field: FormFieldConfig) {
    try {
      const response = await sendValidationRequest(field);
      const data = await response.json();
      return !data.hasOwnProperty('error');
    } catch (error) {
      console.error('Erreur de validation API', error);
      return false;
    }
  }
  
  async function sendValidationRequest(field: FormFieldConfig) {
    //must be implemented with the correct url
  return await fetch(``, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      field,
      value: formData.value[field.name], 
    }),
  });
}

async function onSubmit() {
  let isFormValid = true;

  for (const field of props.formConfig) {
    if (field.apiOptions) {
      isFormValid = await validateFieldWithApi(field);
      if (!isFormValid) break; 
    }
  }

  if (isFormValid) {
    props.onSubmit();
  }
}

  </script>
  