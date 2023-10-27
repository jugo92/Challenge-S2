<template>
    <div class="bg-white border border-gray-300 rounded p-4 mt-4">
      <!-- Contact details -->
      <div class="pb-4 flex justify-between">
        <div class="flex items-start mr-6">
          <span class="text-gray-500 w-20 flex-grow-0 flex-shrink-0">Contact</span>
          <span>{{ contact }}</span>
        </div>
        <div class="text-sm text-primary-500"><a href="" @click.prevent="handleChangeData">Change</a></div>
      </div>
      <!-- Payment method -->
      <div v-if="isAtLastStep" class="pt-4 mt-4 border-t border-gray-200 flex justify-between">
        <div class="flex items-start mr-6">
          <span class="text-gray-500 w-20 flex-grow-0 flex-shrink-0">Method</span>
          <span v-html="method"></span>
        </div>
        <div class="text-sm text-primary-500"><a href="" @click.prevent="handleChangeMethod">Change</a></div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  interface FormType {
    data: {
      email: string;
      address: string;
      address2: string;
      city: string;
      state: string;
      zip_code: string;
      country: string;
      shipping_method: string;
      // Autres propriétés de données
    };
    countries: Record<string, string>;
    steps$: {
      isAtLastStep: boolean;
      goTo(step: string): void;
      // Autres méthodes liées aux étapes
    };
    el$(selector: string): any;
    // Autres propriétés et méthodes du formulaire
  }
  
  const form$ = ref<FormType | null>(null);
  
  const formData = computed(() => form$.value?.data);
  
  const contact = computed(() => {
    return formData.value?.email || ''; // Utilisez une valeur par défaut si 'email' est null ou non défini
  });
  

  const method = computed(() => {
    const data = formData.value;
    if (!data) return ''; // Vérifiez si 'data' est null ou non défini
  
    const shippingMethod = data.shipping_method;
    const shippingMethodItems = form$.value?.el$('shipping_method')?.resolvedOptions;
  
    return shippingMethod
      ? shippingMethodItems?.find((item: any) => item.value === shippingMethod)?.text || ''
      : '';
  });
  
  const isAtLastStep = computed(() => {
    return form$.value?.steps$.isAtLastStep || false; // Utilisez une valeur par défaut
  });
  
  const handleChangeData = () => {
    form$.value?.steps$.goTo('customer_information');
  };
  
  const handleChangeMethod = () => {
    form$.value?.steps$.goTo('shipping_method');
  };
  </script>
  