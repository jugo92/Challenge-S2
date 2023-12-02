<template>
  <div class="flex flex-col gap-2">
    <span class="font-bold text-2xl">Produits et services</span>

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

const tableColumns = [
  { key: 'name', label: 'Nom', filter: true, style: 'font-bold' },
  { key: 'state', label: 'État', filter: true },
  { key: 'quantity', label: 'Quantité', filter: true },
  { key: 'price', label: 'Prix', filter: true },
]
const tableData = ref([])

const fetchProducts = async (includedProperties) => {
  console.log('Récupération des produits depuis l\'API');
  try {
    const response = await fetch('http://localhost:3000/api/products');
    const data = await response.json();
    tableData.value = data.map((product) => {
      const filteredItem = {};
      for (const property of includedProperties) {
        filteredItem[property] = product[property];
      }
      return filteredItem;
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits depuis l\'API', error);
  }
};
const createProduct = async (data) => {
  console.log('Création du produit', formConfig.value);
  for (const field of formConfig.value) {
    if (!field.value && field.required) {
      field.validationError = { message: 'Ce champ est obligatoire' };
      continue;
    }
    if (!field.value && field.type === 'select') {
      field.value = 0;
      continue;
    }
    if(await isExistingProduct() && !formConfig.id) {
      field.validationError = { message: 'Ce produit existe déjà' };
      return;
    }
  }

  if (formConfig.value.some(field => field.validationError)) {
    return;
  }

  const promotionField = formConfig.value.find(field => field.name === 'promotion');
  console.log("promotionField", promotionField["value"]);
  const selectedPromotion = promotionField["value"]
  console.log("selectedPromotion", selectedPromotion);

  const requestBody = {
    CategoryId: formConfig.value.find(field => field.name === 'categories').value,
    MarqueId: formConfig.value.find(field => field.name === 'brands').value,
    CaractetistiqueId: '018c0d75-1908-7d35-accb-6a22d6c617b8',
    TvaId: formConfig.value.find(field => field.name === 'tvas').value,
    name: formConfig.value.find(field => field.name === 'name').value,
    description: formConfig.value.find(field => field.name === 'description').value,
    quantity: formConfig.value.find(field => field.name === 'quantite').value,
    price: formConfig.value.find(field => field.name === 'prixTTC').value,
    deliveryDate: 0,
    image: 'https://picsum.photos/200/300',
    state: formConfig.value.find(field => field.name === 'state').value,
    promotion: selectedPromotion.id || 0,
  };
  if(formConfig.id) {
    requestBody.id = formConfig.id;
    fetch('http://localhost:3000/api/products/' + formConfig.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          location.reload();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }else {
    fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          location.reload();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }
};

const isExistingProduct = async () => {
  const nameField = formConfig.value.find(field => field.name === 'name');
  const name = nameField.value;

  fetch(`http://localhost:3000/api/products/IsProductExist/${name}`)
      .then(response => response.json())
      .then(data => {
        if (data === true) {
          nameField.validationError = { message: 'Ce produit existe déjà' };
          return true;
        }
      })
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
  'Reconditionné': 3,
  'Seconde Main': 4
};
const openModalCreate = (instance, data) => {
  if(data === undefined) {
    openModal();
    return;
  }
  else{
    fetch("http://localhost:3000/api/" + instance + "/" + data)
        .then(response => response.json())
        .then(data => {
          getInstanceForm(instance, formConfig, data);
          openModal();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }
};

const getInstanceForm = (instance, formConfig, data) => {
  switch (instance) {
    case 'products':
      formConfig.value.find(field => field.name === 'id').value = data.id;
      formConfig.value.find(field => field.name === 'name').value = data.name;
      formConfig.value.find(field => field.name === 'description').value = data.description;
      formConfig.value.find(field => field.name === 'quantite').value = data.quantity;
      formConfig.value.find(field => field.name === 'prixTTC').value = data.price;
      formConfig.value.find(field => field.name === 'state').value = stateOptions[data.state];
      formConfig.value.find(field => field.name === 'promotion').value = data.promotion;
      formConfig.value.find(field => field.name === 'brands').value = data.MarqueId;
      formConfig.value.find(field => field.name === 'tvas').value = data.TvaId;
      formConfig.value.find(field => field.name === 'categories').value = data.CategoryId;
      break;
    case 'categories':
      formConfig.value.find(field => field.name === 'id').value = data.id;
      formConfig.value.find(field => field.name === 'name').value = data.name;
      formConfig.value.find(field => field.name === 'description').value = data.description;
      break;
    case 'marques':
      formConfig.value.find(field => field.name === 'id').value = data.id;
      formConfig.value.find(field => field.name === 'name').value = data.name;
      formConfig.value.find(field => field.name === 'description').value = data.description;
      break;
    case 'tvas':
      formConfig.value.find(field => field.name === 'id').value = data.id;
      formConfig.value.find(field => field.name === 'rate').value = data.rate;
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



const filterMarques = () => {
  const searchField = formConfig.value.find((field) => field.name === 'brands' && field.type === 'search');
  const inputValue = searchField.value;

  searchField.suggestions = marques.value.filter(
      (marque) => marque.name.toLowerCase().includes(inputValue)
  );
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

const formConfig = ref([
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
    changeHandlers: [isExistingProduct],
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
    showCondition: () => formConfig.value.find(field => field.name === 'promotion').value !== ''
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
    buttonClick: createProduct,
    showCondition: () => true
  },
  {
    name: 'id',
  }
]);

onMounted(async () => {
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
  fetchProducts(['id', 'name', 'state', 'quantity', 'price']);
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