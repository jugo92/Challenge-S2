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
      placeholder: 'Entrez votre nom',
      required: true,

    },

  ];
  
  
  const onSubmit = (formData: Record<string, any>) => {
    fetch(`localhost:3000/api/produit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };
  </script>
  
  <style scoped>
  body {
    background-color: #f3f4f6;
    }
    </style>