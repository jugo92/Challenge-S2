<template>
    <div class="mt-12">
        <h1 class="text-center">Test formBuilder</h1>
      <FormBuilder :form-config="formConfig" :on-submit="onSubmit" />
    </div>
  </template>
  
  
  <script setup lang="ts">

  import FormBuilder from './FormBuilder.vue';

  
  const formConfig = [
    {
      type: 'text',
      label: 'Nom',
      name: 'name',
      required: true,
    },

    {
      type: 'select',
      label: 'Rôle',
      name: 'role',
      required: true,
      apiOptions: {
        //can be implemented with the correct url
        url: ``,
        method: 'GET',
      },
    },

  ];
  
  
  const onSubmit = (formData: Record<string, any>) => {
    console.log(formData);
  };
  </script>
  
  <style scoped>
  body {
    background-color: #f3f4f6;
    }
    </style>