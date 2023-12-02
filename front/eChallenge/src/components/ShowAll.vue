<template>
  <div class="flex flex-col gap-2">
    <span class="font-bold text-2xl">List of {{$route.path.substring(1)}}</span>

    <Modal
        title="test"
        content="formBuilder"
        :show="isModalVisible"
        @close="closeModal"
        :formConfig="formConfig"
    />
    <div>
      <TabBuilder :columns="tableColumns" :data="tableData" @open="openModalCreate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import { z } from "zod";
import {useModal} from "./Modal/useModal.ts";
import {useForm} from "./Form/formHelper.ts";
import TabBuilder from "./Table/TableBuilder.vue";
import Modal from "./Modal/Modal.vue";

const { isModalVisible, openModal, closeModal } = useModal();
const { reinitForm, validateField } = useForm()

const instance = window.location.pathname.substring(1);
let isUpdateItem = ref(null);

import {apiService} from "../services/apiService.ts";

console.log("produit IMac", apiService.getOne("products", "018c27a3-2ec1-798f-9533-4045120fc264"));

//////////////////////////////////
///   DEFINITION DES DONNEES  ///
////////////////////////////////
const getTableColumns = (instance) => {
  switch (instance){
    case 'products':
      return [
        { key: 'name', label: 'Nom', filter: true, style: 'font-bold' },
        { key: 'brands', label: 'Marque', filter: true },
        { key: 'state', label: 'État', filter: true },
        { key: 'quantity', label: 'Quantité', filter: true },
        { key: 'price', label: 'Prix', filter: true },
      ];
    case 'marques':
      return [
        { key: 'name', label: 'Nom', filter: true, style: 'font-bold' },
        { key: 'image', label: 'Image', filter: true },
      ];
    case 'categories':
      return [
        { key: 'name', label: 'Nom', filter: true, style: 'font-bold' },
        { key: 'description', label: 'Description', filter: true },
      ];
    case 'tvas':
      return [
        { key: 'rate', label: 'Taux', filter: true, style: 'font-bold' },
      ];
    case 'caracteristiques':
      return [
        { key: 'description', label: 'Description', filter: true },
      ];
    default:
      return;
  }
}
const tableColumns = getTableColumns(instance);
const tableData = ref([])

const getIncludedProperties = (instance) => {
  switch (instance) {
    case 'products':
      return ['id', 'name', 'MarqueId', 'state', 'quantity', 'price'];
    case 'marques':
      return ['id', 'name', 'image'];
    case 'categories':
      return ['id', 'name', 'description'];
    case 'tvas':
      return ['id', 'rate'];
    default:
      return;
  }
};

const getRequestBody = (formConfig) => {
  switch (instance) {
    case "products":
      const promotionField = formConfig.find(field => field.name === 'promotion');
      const selectedPromotion = promotionField["value"]
      return {
        CategoryId: formConfig.find(field => field.name === 'categories').value,
        MarqueId: formConfig.find(field => field.name === 'brands').value,
        CaractetistiqueId: '018c0d75-1908-7d35-accb-6a22d6c617b8',
        TvaId: formConfig.find(field => field.name === 'tvas').value,
        name: formConfig.find(field => field.name === 'name').value,
        description: formConfig.find(field => field.name === 'description').value,
        quantity: formConfig.find(field => field.name === 'quantite').value,
        price: formConfig.find(field => field.name === 'prixTTC').value,
        deliveryDate: 0,
        image: 'https://picsum.photos/200/300',
        state: formConfig.find(field => field.name === 'state').value,
        promotion: selectedPromotion.id || 0,
      };
    case "marques":
      return {
        name: formConfig.find(field => field.name === 'name').value,
        image: formConfig.find(field => field.name === 'image').value,
      };
    case "categories":
      return {
        name: formConfig.find(field => field.name === 'name').value,
        description: formConfig.find(field => field.name === 'description').value,
      };
    case "tvas":
      return {
        rate: formConfig.find(field => field.name === 'rate').value,
      };
    default:
      return;
  }
};

const getInstanceForm = (instance, formConfig, data) => {
  console.log("data", data);
  switch (instance) {
    case 'products':
      formConfig.value.find(field => field.name === 'id').value = data ? data.id : null;
      formConfig.value.find(field => field.name === 'name').value = data ? data.name : '';
      formConfig.value.find(field => field.name === 'description').value = data ? data.description : '';
      formConfig.value.find(field => field.name === 'quantite').value = data ? data.quantity : 0;
      formConfig.value.find(field => field.name === 'prixTTC').value = data ? data.price : 0;
      formConfig.value.find(field => field.name === 'state').value = data ? stateOptions[data.state] : 0;
      formConfig.value.find(field => field.name === 'promotion').value = data ? data.promotion : 0;
      formConfig.value.find(field => field.name === 'brands').value = data ? data.MarqueId : null;
      formConfig.value.find(field => field.name === 'tvas').value = data ? data.TvaId : null;
      formConfig.value.find(field => field.name === 'categories').value = data ? data.CategoryId : null;
      break;
    case 'marques':
      formConfig.value.find(field => field.name === 'id').value = data ? data.id : null;
      formConfig.value.find(field => field.name === 'name').value = data ? data.name : '';
      formConfig.value.find(field => field.name === 'image').value = data ? data.image : '';
      break;
    case 'categories':
      formConfig.value.find(field => field.name === 'id').value = data ? data.id : null;
      formConfig.value.find(field => field.name === 'name').value = data ? data.name : '';
      formConfig.value.find(field => field.name === 'description').value = data ? data.description : '';
      break;
    case 'tvas':
      formConfig.value.find(field => field.name === 'id').value = data ? data.id : null;
      formConfig.value.find(field => field.name === 'rate').value = data ? data.rate : '';
      break;
    case 'caracteristiques':
      formConfig.value.find(field => field.name === 'id').value = data.id;
      formConfig.value.find(field => field.name === 'name').value = data.name;
      formConfig.value.find(field => field.name === 'description').value = data.description;
      break;
    default:
      break;
  }
};

const getInstanceFormConfig = (instance) => {
  switch (instance) {
    case 'products':
      return [
        {
          label: 'Catégorie',
          type: 'select',
          name: 'categories',
          value: '',
          optionsType: 'dynamic',
          options: [],
          labelKey: 'name',
          valueKey: 'id',
          required: true,
          changeHandlers: [],
          showCondition: () => true
        },
        {
          label: 'Marque',
          type: 'select',
          optionsType: 'static',
          options: [],
          name: 'brands',
          value: '',
          // valueId: '',
          labelKey: 'name',
          valueKey: 'id',
          placeholder: 'Saisissez le nom de la marque...',
          required: true,
          showCondition: () => true,
        },
        {
          label: 'TVA (%)',
          type: 'select',
          name: 'tvas',
          value: '',
          optionsType: 'dynamic',
          options: [],
          labelKey: 'rate',
          valueKey: 'id',
          required: true,
          changeHandlers: [updatePrixHT],
          showCondition: () => true
        },
        {
          label: 'Nom',
          type: 'text',
          name: 'name',
          value: '',
          placeholder: 'Saisissez le nom du produit...' ,
          required: true,
          changeHandlers: [],
          validationError: '',
          validationSchema: z.string()
              .min(3, { message: 'Le nom doit contenir au moins 3 caractères' })
              .max(255, { message: 'Le nom doit contenir au maximum 255 caractères' })
          ,
          showCondition: () => true
        },
        {
          label: 'Description',
          type: 'textarea',
          name: 'description',
          value: '',
          placeholder: 'Saisissez la description du produit...',
          required: true,
          validationError: '',
          validationSchema: z.string()
              .min(3, { message: 'La description doit contenir au moins 3 caractères' })
              .max(255, { message: 'La description doit contenir au maximum 255 caractères' }),
          showCondition: () => true
        },
        {
          label: 'État',
          type: 'select',
          name: 'state',
          value: '',
          optionsType: 'static',
          options: [
            { id: '1', name: 'Neuf', value: 'Neuf' },
            { id: '2', name: 'Occasion', value: 'Occasion' },
            { id: '3', name: 'Reconditionné', value: 'Reconditionné' },
            { id: '4', name: 'Seconde Main', value: 'Seconde Main'}
          ],
          showCondition: () => true
        },
        {
          label: 'Quantite',
          type: 'number',
          name: 'quantite',
          value: '0',
          min: 0,
          required: true,
          validationError: '',
          validationSchema: z.number().min(0, { message: 'La quantité doit être supérieure à 0' }),
          showCondition: () => true
        },
        {
          label: 'Prix TTC',
          type: 'number',
          name: 'prixTTC',
          value: '0',
          min: 0,
          max: 9999,
          required: true,
          changeHandlers: [updatePrixHT, updatePrixTTCAfterPromotion],
          validationError: '',
          validationSchema: z.number().min(0, { message: 'Le prix doit être supérieur à 0' }),
          showCondition: () => true
        },
        {
          label: 'Prix HT',
          type: 'label',
          name: 'prixHT',
          value: '0.00',
          readonly: true,
          showCondition: () => true
        },
        {
          label: 'Promotion',
          type: 'select',
          name: 'promotion',
          value: '',
          optionsType: 'static',
          changeHandlers: [updatePrixTTCAfterPromotion],
          options: [
            { id: '0', name: 'Aucune', value: 0 },
            { id: '10', name: '10 % (dix pourcent)', value: 10 },
            { id: '20', name: '20 % (vingt pourcent)', value: 20 },
            { id: '30', name: '30 % (trente pourcent)', value: 30 },
            { id: '40', name: '40 % (quarante pourcent)', value: 40 },
            { id: '50', name: '50 % (cinquante pourcent)', value: 50 },
            { id: '60', name: '60 % (soixante pourcent)', value: 60 },
            { id: '70', name: '70 % (soixante-dix pourcent)', value: 70 },
            { id: '80', name: '80 % (quatre-vingt pourcent)', value: 80 },
            { id: '90', name: '90 % (quatre-vingt-dix pourcent)', value: 90 },
            { id: '100', name: '100 % (cent pourcent)', value: 100},
          ],
          showCondition: () => true,
        },
        {
          label: 'Prix TTC après promotion',
          type: 'label',
          name: 'prixTTCAfterPromotion',
          value: '0.00',
          readonly: true,
          showCondition: () => true
        },
        {
          label: 'Ajouter une ou plusieurs images',
          type: 'file',
          name: 'images',
          showCondition: () => true
        },
        {
          type: 'button',
          label: 'Enregistrer',
          buttonType: 'button',
          buttonClass: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
          buttonClick: createInstance,
          showCondition: () => true
        },
        {
          name: 'id',
        }
      ];
    case 'marques':
      return [
        {
          label: 'Nom',
          type: 'text',
          name: 'name',
          value: '',
          placeholder: 'Saisissez le nom de la marque...' ,
          required: true,
          changeHandlers: [],
          validationError: '',
          validationSchema: z.string()
              .min(3, { message: 'Le nom doit contenir au moins 3 caractères' })
              .max(255, { message: 'Le nom doit contenir au maximum 255 caractères' })
          ,
          showCondition: () => true
        },
        {
          label: 'Image',
          type: 'text',
          name: 'image',
          value: '',
          placeholder: 'Saisissez la description de la marque...',
          showCondition: () => true
        },
        {
          type: 'button',
          label: 'Enregistrer',
          buttonType: 'button',
          buttonClass: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
          buttonClick: createInstance,
          showCondition: () => true
        },
        {
          name: 'id',
        }
      ]
    case 'categories':
      return [
        {
          label: 'Nom',
          type: 'text',
          name: 'name',
          value: '',
          placeholder: 'Saisissez le nom de la catégorie...' ,
          required: true,
          changeHandlers: [],
          validationError: '',
          validationSchema: z.string()
              .min(3, { message: 'Le nom doit contenir au moins 3 caractères' })
              .max(255, { message: 'Le nom doit contenir au maximum 255 caractères' })
          ,
          showCondition: () => true
        },
        {
          label: 'Description',
          type: 'textarea',
          name: 'description',
          value: '',
          placeholder: 'Saisissez la description de la catégorie...',
          required: true,
          validationError: '',
          validationSchema: z.string()
              .min(3, { message: 'La description doit contenir au moins 3 caractères' })
              .max(255, { message: 'La description doit contenir au maximum 255 caractères' }),
          showCondition: () => true
        },
        {
          type: 'button',
          label: 'Enregistrer',
          buttonType: 'button',
          buttonClass: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
          buttonClick: createInstance,
          showCondition: () => true
        },
        {
          name: 'id',
        }
      ]
    case 'tvas':
      return [
        {
          label: 'Taux',
          type: 'number',
          name: 'rate',
          value: '',
          placeholder: 'Saisissez le taux de la TVA...' ,
          required: true,
          changeHandlers: [],
          validationError: '',
          validationSchema: z.number()
              .min(0, { message: 'Le taux doit être supérieur à 0' })
              .max(100, { message: 'Le taux doit être inférieur à 100' })
          ,
          showCondition: () => true
        },
        {
          type: 'button',
          label: 'Enregistrer',
          buttonType: 'button',
          buttonClass: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
          buttonClick: createInstance,
          showCondition: () => true
        },
        {
          name: 'id',
        }
      ]
    default:
      return;
  }
}

/////////////////////////////
///   FONCTIONS OUTILS   ///
////////////////////////////

const fetchListOfItems = async () => {
  const includedProperties = getIncludedProperties(instance);
  try {
    const response = await fetch('http://localhost:3000/api/' + instance);
    const data = await response.json();
    tableData.value = data.map((item) => {
      const filteredItem = {};
      for (const property of includedProperties) {
        filteredItem[property] = item[property];
      }
      return filteredItem;
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits depuis l\'API', error);
  }
};

const createInstance = async (data) => {
  for (const field of formConfig.value) {
    if (!field.value && field.required) {
      field.validationError = { message: 'Ce champ est obligatoire' };
      continue;
    }
    if (!field.value && field.type === 'select') {
      field.value = 0;
      continue;
    }
    //TODO : vérifier si l'instance existe déjà
    // if(await isExistingProduct() && !formConfig.id) {
    //   field.validationError = { message: 'Ce produit existe déjà' };
    //   return;
    // }
  }

  if (formConfig.value.some(field => field.validationError)) {
    return;
  }

  let requestBody = getRequestBody(formConfig.value);
  if(!isUpdateItem) {
    fetch('http://localhost:3000/api/' + instance, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
          location.reload();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }else {
    const itemId =  formConfig.value.find(field => field.name === 'id').value;
    fetch('http://localhost:3000/api/' + instance + '/' + itemId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
          location.reload();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }
};

const fetchOptions = async (field, callback) => {
  const url = `http://localhost:3000/api/${field}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    callback(data);
  } catch (error) {
    console.error(`Erreur lors de la récupération des options depuis l'API ${url}`, error);
  }
};

const marques = ref([]);
const stateOptions = {
  'Neuf': 1,
  'Occasion': 2,
  'Reconditionne': 3,
  'Seconde Main': 4
};
const openModalCreate = (instance, isUpdate, data) => {
  isUpdateItem = isUpdate;
  if(!isUpdateItem) {
    formConfig.value = getInstanceFormConfig(instance);
    openModal();
    return;
  }
  else{
    apiService.getOne(instance, data)
        .then(data => {
          formConfig.value.filter(field => field.name === 'id').value = data.id ;
          getInstanceForm(instance, formConfig, data);
          openModal();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }
};

const updatePrixHT = () => {
  const prixTTCField = formConfig.value.find(field => field.name === 'prixTTC');
  const tvasField = formConfig.value.find(field => field.name === 'tvas');
  const selectedTva = tvasField.options.find(option => option.id === tvasField.value);

  const prixTTC = prixTTCField.value || 0;
  const tva = selectedTva ? selectedTva.taux : 0;

  const prixHT = prixTTC - (prixTTC * tva / 100);
  formConfig.value.find(field => field.name === 'prixHT').value = prixHT.toFixed(2);
};

const updatePrixTTCAfterPromotion = () => {
  const promotionField = formConfig.value.find(field => field.name === 'promotion');
  const selectedPromotion = promotionField.options.find(option => option.id === promotionField.value);

  const prixTTCField = formConfig.value.find(field => field.name === 'prixTTC');
  const prixTTC = prixTTCField.value || 0;

  const prixTTCAfterPromotion = (1 - selectedPromotion.value / 100) * prixTTC;
  formConfig.value.find(field => field.name === 'prixTTCAfterPromotion').value = prixTTCAfterPromotion.toFixed(2);
};

let formConfig = ref([]);

onMounted(async () => {
  formConfig.value = getInstanceFormConfig(instance);
  await fetchOptions('marques', (data) => {
    // marques.value = data;
    const brandsField = formConfig.value.find(field => field.name === 'brands');
    brandsField.options = data;
  });
  await fetchOptions('tvas', (data) => {
    const tvasField = formConfig.value.find(field => field.name === 'tvas');
    tvasField.options = data;
  });
  await fetchOptions('categories', (data) => {
    const categoriesField = formConfig.value.find(field => field.name === 'categories');
    categoriesField.options = data;
  });
  fetchListOfItems();
  for (const field of formConfig.value) {
    if (field.validationSchema) {
      watch(() => field.value, async () => {
        await validateField(field);
      });
    }
  }
});

</script>

<style scoped>

</style>