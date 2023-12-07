<template>
  <div class="flex flex-col gap-2">
    <Modal
        content="formBuilder"
        :show="isModalVisible"
        @close="closeModal"
        :formConfig="formConfig"
    />
    <div>
      <TabBuilder :columns="tableColumns" :data="tableData" @open="openModalInstance" :update="fetchListOfItems" :pageIndex="pageIndex"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted,  reactive, ref, watch} from 'vue';
import { z } from "zod";
import {useModal} from "./Modal/useModal.ts";
import {useForm} from "./Form/formHelper.ts";
import TabBuilder from "./Table/TableBuilder.vue";
import { unselectAllItems } from './Table/tableHelper.ts';
import Modal from "./Modal/Modal.vue";

const { isModalVisible, openModal, closeModal } = useModal();
const { validateField } = useForm();

const splitUrl = window.location.pathname.split("/");
const instance = splitUrl[splitUrl.length - 1];
let isUpdateItem = ref(null);

import {apiService} from "../services/apiService.ts";
import {forEach} from "lodash";


//////////////////////////////////
///   DEFINITION DES DONNEES  ///
////////////////////////////////
const getTableColumns = (instance) => {
  switch (instance){
    case 'products':
      return [
        { key: 'name', label: 'Nom', filter: true, style: 'font-bold underline', link: 'products'},
        { key: 'Category.name', label: 'Catégorie', filter: true },
        { key: 'Marque.name', label: 'Marque', filter: true },
        { key: 'price', label: 'Prix', filter: true },
        { key: 'quantity', label: 'Quantité', filter: true },
        { key: 'state', label: 'État', filter: true },
        { key: 'promotion', label: 'Promotion', filter: true },
        { key: 'isPublished', label: 'Est Publié', filter: true },
      ];
    case 'brands':
      return [
        { key: 'name', label: 'Nom', filter: true, style: 'font-bold' },
        { key: 'description', label: 'Description', filter: true, },
        { key: 'image', label: 'Image', filter: true },
      ];
    case 'categories':
      return [
        { key: 'name', label: 'Nom', filter: true, style: 'font-bold' },
        { key: 'description', label: 'Description', filter: true },
      ];
    case 'users':
      return [
        { key: 'firstname+lastname', label: 'Nom Prénom', filter: true, style: 'font-bold underline', link: 'users' },
        { key: 'email', label: 'Email', filter: true },
        { key: 'role', label: 'Rôle', filter: true },
        { key: 'isVerified', label: 'Est vérifié', filter: true },
        { key: 'isActive', label: 'Est actif', filter: true },
        { key: 'createdAt', label: 'Créé le', filter: true },
        { key: 'updatedAt', label: 'Mis à jour le', filter: true },
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
      return ['_id', 'name', 'Category.name', 'Marque.name', 'price', 'quantity', 'state', 'promotion', 'isPublished', 'quantity_alert'];
    case 'brands':
      return ['id', 'name', 'description', 'image'];
    case 'categories':
      return ['id', 'name', 'description'];
    case 'users':
      return ['id', 'firstname+lastname', 'email', 'role', 'isVerified', 'isActive', 'createdAt', 'updatedAt'];
    default:
      return;
  }
};

const getRequestBody = (formConfig) => {
  switch (instance) {
    case "products":
      const formProduct = new FormData();
      formProduct.append('file', formConfig.find(field => field.name === 'files').value)
      formProduct.append('CategoryId', formConfig.find(field => field.name === 'categories').value)
      formProduct.append('MarqueId', formConfig.find(field => field.name === 'brands').value )
      formProduct.append('name',  formConfig.find(field => field.name === 'name').value)
      formProduct.append('description', formConfig.find(field => field.name === 'description').value)
      formProduct.append('quantity', formConfig.find(field => field.name === 'quantite').value)
      formProduct.append('price', formConfig.find(field => field.name === 'prixTTC').value)
      formProduct.append('state',formConfig.find(field => field.name === 'state').value)
      formProduct.append('promotion', formConfig.find(field => field.name === 'promotion').value || 0)
      if(formConfig.find(field => field.name === 'images').value !== undefined) {
        formProduct.append('image', formConfig.find(field => field.name === 'files').value.name)
      }
      formProduct.append('isPublished', formConfig.find(field => field.name === 'isPublished').isChecked)
      formProduct.append('resolution', formConfig.find(field => field.name === 'resolution').value)
      formProduct.append('size', formConfig.find(field => field.name === 'size').value)
      formProduct.append('storage', formConfig.find(field => field.name === 'storage').value)
      formProduct.append('loudspeaker', formConfig.find(field => field.name === 'loudspeaker').value)
      formProduct.append('frontcamera', formConfig.find(field => field.name === 'frontcamera').value)
      formProduct.append('weight', formConfig.find(field => field.name === 'weight').value)
      formProduct.append('width', formConfig.find(field => field.name === 'width').value)
      formProduct.append('height', formConfig.find(field => field.name === 'height').value)
      formProduct.append('battery', formConfig.find(field => field.name === 'battery').value)
      formProduct.append('code', formConfig.find(field => field.name === 'code').value)
      formProduct.append('accesories', formConfig.find(field => field.name === 'accesories').value)
      formProduct.append('operatingSystem', formConfig.find(field => field.name === 'os').value)
      formProduct.append('cpu', formConfig.find(field => field.name === 'cpu').value)
      formProduct.append('gpu', formConfig.find(field => field.name === 'gpu').value)
      formProduct.append('quantity_alert', formConfig.find(field => field.name === 'quantity_alert').value)
      return formProduct
    case "brands":
      const formMarque = new FormData();
      formMarque.append('file', formConfig.find(field => field.name === 'files').value)
      formMarque.append('name', formConfig.find(field => field.name === 'name').value)
      formMarque.append('description', formConfig.find(field => field.name === 'description').value)
      if(formConfig.find(field => field.name == "images").value != undefined) {
        formMarque.append('image', formConfig.find(field => field.name === 'files').value.name)
      }else{
        formMarque.append('image', "")
      }
      return formMarque
    case "categories":
      return {
        name: formConfig.find(field => field.name === 'name').value,
        description: formConfig.find(field => field.name === 'description').value,
      };
    case "users":
      console.log(formConfig.find(field => field.name === 'password').value);
      return {
        firstname: formConfig.find(field => field.name === 'firstname').value,
        lastname: formConfig.find(field => field.name === 'lastname').value,
        gender: formConfig.find(field => field.name === 'gender').value,
        dateOfBirth: formConfig.find(field => field.name === 'dateOfBirth').value,
        email: formConfig.find(field => field.name === 'email').value,
        phone: formConfig.find(field => field.name === 'phone').value,
        address: formConfig.find(field => field.name === 'address').value,
        zip: formConfig.find(field => field.name === 'zip').value,
        city: formConfig.find(field => field.name === 'city').value,
        role: formConfig.find(field => field.name === 'role').value,
        isVerified: formConfig.find(field => field.name === 'isVerified').value,
        isActive: formConfig.find(field => field.name === 'isActive').value,
        // password: formConfig.find(field => field.name === 'password').value,
      }
    default:
      return;
  }
};

const getInstanceForm = (instance, formConfig, data) => {
  console.log("data", data, formConfig, instance)
  switch (instance) {
    case 'products':
      formConfig.value.find(field => field.name === 'id').value = data ? data._id : null;
      formConfig.value.find(field => field.name === 'name').value = data ? data.name : '';
      formConfig.value.find(field => field.name === 'description').value = data ? data.description : '';
      formConfig.value.find(field => field.name === 'quantite').value = data ? data.quantity : 0;
      formConfig.value.find(field => field.name === 'prixTTC').value = data ? data.price : 0;
      formConfig.value.find(field => field.name === 'state').value = data ? stateOptions[data.state] : 0;
      formConfig.value.find(field => field.name === 'promotion').value = data ? data.promotion : 0;
      formConfig.value.find(field => field.name === 'brands').value = data && data.Marque ? data.Marque.id : null;
      formConfig.value.find(field => field.name === 'categories').value = data && data.Category ? data.Category.id : null;
      formConfig.value.find(field => field.name === 'isPublished').value = data ? data.isPublished : false;
      formConfig.value.find(field => field.name === 'resolution').value = data ? data.resolution : '';
      formConfig.value.find(field => field.name === 'size').value = data ? data.size : '';
      formConfig.value.find(field => field.name === 'storage').value = data ? data.storage : '';
      formConfig.value.find(field => field.name === 'loudspeaker').value = data ? data.loudspeaker : '';
      formConfig.value.find(field => field.name === 'frontcamera').value = data ? data.frontcamera : '';
      formConfig.value.find(field => field.name === 'weight').value = data ? data.weight : '';
      formConfig.value.find(field => field.name === 'width').value = data ? data.width : '';
      formConfig.value.find(field => field.name === 'height').value = data ? data.height : '';
      formConfig.value.find(field => field.name === 'battery').value = data ? data.battery : '';
      formConfig.value.find(field => field.name === 'code').value = data ? data.code : '';
      formConfig.value.find(field => field.name === 'accesories').value = data ? data.accesories : '';
      formConfig.value.find(field => field.name === 'os').value = data ? data.operatingSystem : '';
      formConfig.value.find(field => field.name === 'cpu').value = data ? data.cpu : '';
      formConfig.value.find(field => field.name === 'gpu').value = data ? data.gpu : '';
      formConfig.value.find(field => field.name === 'files').value = data ? data.image : '';
      formConfig.value.find(field => field.name === 'images').value = data ? data.image : '';
      formConfig.value.find(field => field.name === 'quantity_alert').value = data ? data.quantity_alert : '';
      console.log("formconfig products", formConfig)
      break;
    case 'brands':
      formConfig.value.find(field => field.name === 'id').value = data ? data.id : null;
      formConfig.value.find(field => field.name === 'name').value = data ? data.name : '';
      formConfig.value.find(field => field.name === 'images').value = data || data != "undefined" ? data.image : '';
      formConfig.value.find(field => field.name === 'files').value = data ? data.image : '';
      formConfig.value.find(field => field.name === 'description').value = data ? data.description : '';
      console.log("formconfig brands", data, formConfig)
      break;
    case 'categories':
      formConfig.value.find(field => field.name === 'id').value = data ? data.id : null;
      formConfig.value.find(field => field.name === 'name').value = data ? data.name : '';
      formConfig.value.find(field => field.name === 'description').value = data ? data.description : '';
      break;
    case 'users':
      formConfig.value.find(field => field.name === 'id').value = data ? data.id : null;
      formConfig.value.find(field => field.name === 'firstname').value = data ? data.firstname : '';
      formConfig.value.find(field => field.name === 'lastname').value = data ? data.lastname : '';
      if(data && data.gender == "H"){
        formConfig.value.find(field => field.name === 'gender').value = 1;
      }else if(data && data.gender == "F"){
        formConfig.value.find(field => field.name === 'gender').value = 2;
      }else {
        formConfig.value.find(field => field.name === 'gender').value = 0;
      }
      formConfig.value.find(field => field.name === 'dateOfBirth').value = data ? data.dateOfBirth : '';
      formConfig.value.find(field => field.name === 'email').value = data ? data.email : '';
      formConfig.value.find(field => field.name === 'phone').value = data ? data.phone : '';
      formConfig.value.find(field => field.name === 'address').value = data ? data.address : '';
      formConfig.value.find(field => field.name === 'zip').value = data ? data.zip : '';
      formConfig.value.find(field => field.name === 'city').value = data ? data.city : '';
      if(data && data.role == "admin"){
        formConfig.value.find(field => field.name === 'role').value = 1;
      }else if(data && data.role == "storekeeper"){
        formConfig.value.find(field => field.name === 'role').value = 2;
      }else if(data && data.role == "user"){
        formConfig.value.find(field => field.name === 'role').value = 3;
      }else{
        formConfig.value.find(field => field.name === 'role').value = 0;
      }
      formConfig.value.find(field => field.name === 'isVerified').value = data ? data.isVerified : '';
      formConfig.value.find(field => field.name === 'isActive').value = data ? data.isActive : '';
      // formConfig.value.find(field => field.name === 'password').value = data ? data.password : '';
      console.log("formconfig users", formConfig)
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
          label: 'Nom',
          type: 'text',
          name: 'name',
          value: '',
          placeholder: 'Saisissez le nom du produit...' ,
          required: true,
          changeHandlers: [isExist],
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
          label: 'Catégorie',
          type: 'select',
          name: 'categories',
          value: '',
          optionsType: 'dynamic',
          options: [],
          labelKey: 'name',
          valueKey: '_id',
          required: true,
          changeHandlers: [],
          showCondition: () => true
        },
        {
          label: 'Marque',
          type: 'select',
          optionsType: 'dynamic',
          options: [],
          name: 'brands',
          value: '',
          // valueId: '',
          labelKey: 'name',
          valueKey: '_id',
          placeholder: 'Saisissez le nom de la marque...',
          required: true,
          showCondition: () => true,
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
          label: 'Promotion (%)',
          type: 'number',
          name: 'promotion',
          value: '0',
          min: 0,
          max: 90,
          optionsType: 'static',
          changeHandlers: [updatePrixTTCAfterPromotion],
          validationError: '',
          validationSchema: z.number()
              .min(0, { message: 'La promotion doit être supérieure à 0' })
              .max(90, { message: 'La promotion doit être inférieure à 90' }),
          showCondition: () => true,
        },
        {
          label: "Résolution",
          type: "text",
          name: "resolution",
          value: "",
          placeholder: "Saisissez la résolution de l'écran...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "La résolution doit contenir au moins 3 caractères" })
              .max(255, { message: "La résolution doit contenir au maximum 255 caractères" }),
          showCondition: () => true,
        },
        {
          label: "Taille",
          type: "text",
          name: "size",
          value: "",
          placeholder: "Saisissez la taille de l'écran...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "La taille doit contenir au moins 3 caractères" })
              .max(255, { message: "La taille doit contenir au maximum 255 caractères" }),
          showCondition: () => true,
        },
        {
          label: "Stockage",
          type: "text",
          name: "storage",
          value: "",
          placeholder: "Saisissez la capacité de stockage...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "Le stockage doit contenir au moins 3 caractères" })
              .max(255, { message: "Le stockage doit contenir au maximum 255 caractères" }),
          showCondition: () => true,
        },
        {
          label: "Haut-parleur",
          type: "text",
          name: "loudspeaker",
          value: "",
          placeholder: "Saisissez la qualité du haut-parleur...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "Le haut-parleur doit contenir au moins 3 caractères" })
              .max(255, { message: "Le haut-parleur doit contenir au maximum 255 caractères" }),
          showCondition: () => true,
        },
        {
          label: "Caméra Avant",
          type: "text",
          name: "frontcamera",
          value: "",
          placeholder: "Saisissez la qualité de la caméra avant...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "La caméra avant doit contenir au moins 3 caractères" })
              .max(255, { message: "La caméra avant doit contenir au maximum 255 caractères" }),
          showCondition: () => true,
        },
        {
          label: "Poids",
          type: "text",
          name: "weight",
          value: "",
          placeholder: "Saisissez le poids du produit...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "Le poids doit contenir au moins 3 caractères" })
              .max(255, { message: "Le poids doit contenir au maximum 255 caractères" }),
          showCondition: () => true,
        },
        {
          label: "Largeur",
          type: "text",
          name: "width",
          value: "",
          placeholder: "Saisissez la largeur du produit...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "La largeur doit contenir au moins 3 caractères" })
              .max(255, { message: "La largeur doit contenir au maximum 255 caractères" }),
          showCondition: () => true,
        },
        {
          label: "Hauteur",
          type: "text",
          name: "height",
          value: "",
          placeholder: "Saisissez la hauteur du produit...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "La hauteur doit contenir au moins 3 caractères" })
              .max(255, { message: "La hauteur doit contenir au maximum 255 caractères" }),
          showCondition: () => true,
        },
        {
          label: "Batterie",
          type: "text",
          name: "battery",
          value: "",
          placeholder: "Saisissez la capacité de la batterie...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "La batterie doit contenir au moins 3 caractères" })
              .max(255, { message: "La batterie doit contenir au maximum 255 caractères" }),
          showCondition: () => true,
        },
        {
          label: "Code",
          type: "text",
          name: "code",
          value: "",
          placeholder: "Saisissez le code du produit...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "Le code doit contenir au moins 3 caractères" })
              .max(255, { message: "Le code doit contenir au maximum 255 caractères" }),
          showCondition: () => true,
        },
        {
          label: "Accessoires",
          type: "text",
          name: "accesories",
          value: "",
          placeholder: "Saisissez les accessoires du produit...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "Les accessoires doivent contenir au moins 3 caractères" })
              .max(255, { message: "Les accessoires doivent contenir au maximum 255 caractères" }),
          showCondition: () => true,
        },
        {
          label: "Système d'exploitation",
          type: "text",
          name: "os",
          value: "",
          placeholder: "Saisissez le système d'exploitation du produit...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "Le système d'exploitation doit contenir au moins 3 caractères" })
              .max(255, { message: "Le système d'exploitation doit contenir au maximum 255 caractères" }),
          showCondition: () => true,
        },
        {
          label: "Processeur (CPU)",
          type: "text",
          name: "cpu",
          value: "",
          placeholder: "Saisissez le processeur du produit...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "Le processeur doit contenir au moins 3 caractères" })
              .max(255, { message: "Le processeur doit contenir au maximum 255 caractères" }),
          showCondition: () => true,
        },
        {
          label: "Carte Graphique (GPU)",
          type: "text",
          name: "gpu",
          value: "",
          placeholder: "Saisissez la carte graphique du produit...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "La carte graphique doit contenir au moins 3 caractères" })
              .max(255, { message: "La carte graphique doit contenir au maximum 255 caractères" }),
          showCondition: () => true,
        },
        {
          label: 'Ajouter une image',
          type: 'file',
          name: 'images',
          showCondition: () => true
        },
        {
          label: 'Mettre en ligne le produit',
          type: 'checkbox',
          name: 'isPublished',
          showCondition: () => true
        },
        {
          label: 'Seuil de stock avant alerte',
          type: 'number',
          name: 'quantity_alert',
          value: '0',
          min: 0,
          required: true,
          validationError: '',
          validationSchema: z.number().min(0, { message: 'Le seuil de stock doit être supérieur à 0' }),
        },
        {
          type: 'button',
          label: 'Enregistrer',
          buttonType: 'button',
          buttonClass: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
          buttonClick: createInstance,
          validationError: '',
          showCondition: () => true
        },
        {
          name: 'files',
          value: 'test'
        },
        {
          name: 'id',
        }
      ];
    case 'brands':
      return [
        {
          label: 'Nom',
          type: 'text',
          name: 'name',
          value: '',
          placeholder: 'Saisissez le nom de la marque...' ,
          required: true,
          changeHandlers: [isExist],
          validationError: '',
          validationSchema: z.string()
              .min(3, { message: 'Le nom doit contenir au moins 3 caractères' })
              .max(255, { message: 'Le nom doit contenir au maximum 255 caractères' })
          ,
          showCondition: () => true
        },
        {
          label: 'Description',
          type: 'text',
          name: 'description',
          value: '',
          placeholder: 'Saisissez la description de la marque...' ,
          required: true,
          changeHandlers: [],
          validationError: '',
          validationSchema: z.string()
              .min(3, { message: 'La description doit contenir au moins 3 caractères' })
              .max(255, { message: 'La description doit contenir au maximum 255 caractères' })
          ,
          showCondition: () => true
        },
        {
          label: 'Ajouter une ou plusieurs images',
          type: 'file',
          name: 'images',
          value: '',
          showCondition: () => formConfig.value.find(field => field.name == "images").value === "" || formConfig.value.find(field => field.name == "images").value === undefined
        },
        {
          name: 'files',
          value: ''
        },
        {
          name: 'id',
        },
        {
          type: 'button',
          label: 'Enregistrer',
          buttonType: 'button',
          buttonClass: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
          buttonClick: createInstance,
          showCondition: () => true
        },
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
          changeHandlers: [isExist],
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
    case 'users':
      return [
        {
          label: "Genre",
          type: "select",
          name: "gender",
          value: "",
          optionsType: "static",
          options: [
            { id: "1", name: "Homme", value: "Homme" },
            { id: "2", name: "Femme", value: "Femme" },
          ],
        },
        {
          label: "Date de naissance",
          type: "date",
          name: "dateOfBirth",
          value: "",
          placeholder: "Saisissez la date de naissance de l'utilisateur...",
          required: true,
          validationError: "",
          validationSchema: z.date().refine(
              (value) => {
                const date = new Date(value);
                const now = new Date();
                const diff = now - date;
                const age = Math.floor(diff / 31557600000);
                return age >= 18;
              },
              { message: "Vous devez avoir au moins 18 ans" }
          )
        },
        {
          label: "Prénom",
          type: "text",
          name: "firstname",
          value: "",
          placeholder: "Saisissez le prénom de l'utilisateur...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "Le prénom doit contenir au moins 3 caractères" })
              .max(50, { message: "Le prénom doit contenir au maximum 50 caractères" }),
        },
        {
          label: "Nom",
          type: "text",
          name: "lastname",
          value: "",
          placeholder: "Saisissez le nom de l'utilisateur...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "Le nom doit contenir au moins 3 caractères" })
              .max(50, { message: "Le nom doit contenir au maximum 50 caractères" }),
        },
        {
          label: "Email",
          type: "email",
          name: "email",
          value: "",
          placeholder: "Saisissez l'email de l'utilisateur...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .email({ message: "L'email n'est pas valide" })
              .min(3, { message: "L'email doit contenir au moins 3 caractères" })
              .max(255, { message: "L'email doit contenir au maximum 255 caractères" }),
        },
        {
          label: "Téléphone (+33)",
          type: "text",
          name: "phone",
          value: "",
          placeholder: "Saisissez le téléphone de l'utilisateur...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(10, { message: "Le téléphone doit contenir au moins 10 caractères" })
              .max(10, { message: "Le téléphone doit contenir au maximum 10 caractères" }),
        },
        {
          label: "Adresse",
          type: "text",
          name: "address",
          value: "",
          placeholder: "Saisissez l'adresse de l'utilisateur...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "L'adresse doit contenir au moins 3 caractères" })
              .max(255, { message: "L'adresse doit contenir au maximum 255 caractères" }),
        },
        {
          label: "Code Postal",
          type: "text",
          name: "zip",
          value: "",
          placeholder: "Saisissez le code postal de l'utilisateur...",
          required: true,
          validationError: "",
          validationSchema: z.number()
              .min(3, { message: "Le code postal doit contenir au moins 3 caractères" })
              .max(255, { message: "Le code postal doit contenir au maximum 255 caractères" }),
        },
        {
          label: "Ville",
          type: "text",
          name: "city",
          value: "",
          placeholder: "Saisissez la ville de l'utilisateur...",
          required: true,
          validationError: "",
          validationSchema: z.string()
              .min(3, { message: "La ville doit contenir au moins 3 caractères" })
              .max(255, { message: "La ville doit contenir au maximum 255 caractères" }),
        },
        {
          label: "Rôle",
          type: "select",
          name: "role",
          value: "",
          required: true,
          optionsType: "static",
          options: [
            { id: "1", name: "admin", value: "Administrateur" },
            { id: "2", name: "storekeeper", value: "Gestionnaire de Stock" },
            { id: "3", name: "user", value: "Utilisateur" },
          ],
        },
        {
          label: "Est Vérifié",
          type: "checkbox",
          name: "isVerified",
        },
        {
          label: "Est Actif",
          type: "checkbox",
          name: "isActive",
        },
        {
          type: 'button',
          label: 'Enregistrer',
          buttonType: 'button',
          buttonClass: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
          buttonClick: createInstance,
        },
        {
          label: "Mot de passe",
          type: "password",
          name: "password",
          value: 'Jug123456@@@',
          validationError: "",
          validationSchema: z.string()
              .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
              .max(255, { message: "Le mot de passe doit contenir au maximum 255 caractères" }),
          showCondition: () => false,
        },
        {
          name: "id",
        },
      ]
    default:
      return;
  }
}
/////////////////////////////
///   FONCTIONS OUTILS   ///
////////////////////////////
let currentPage = 1;
let limit = 2;
const fetchListOfItems = async () => {
  const includedProperties = getIncludedProperties(instance);
  try {
    const response = await fetch('http://localhost:3000/api/' + instance + "?page=" + pageIndex.currentPage + "&limit=" + pageIndex.limit);
    const data = await response.json();
    tableData.value = data.map((item) => {
      const filteredItem = {};
      for (const property of includedProperties) {
        if(property.includes('.')){
          if(item.hasOwnProperty(property.split('.')[0])){
            filteredItem[property] = item[property.split('.')[0]][property.split('.')[1]]
          }
        }else if(property.includes('+')) {
          if (item.hasOwnProperty(property.split('+')[0])) {
            filteredItem[property] = item[property.split('+')[0]] + ' ' + item[property.split('+')[1]]
          }
        }
        else  {
          filteredItem[property] = item[property] || '';
        }
      }
      return filteredItem;
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits depuis l\'API', error);
  }
};

const afterInstanceSave = () => {
  isModalVisible.value = false;
  setTimeout(() => {
    fetchListOfItems();
  }, 500);
}

const createInstance = async (data) => {
  for (const field of formConfig.value) {
    // if (!field.value && field.required) {
    //     field.validationError = { message: 'Ce champ est obligatoire' };
    //     continue;
    // }
    // if (!field.value && field.type === 'select') {
    //     field.value = 0;
    //     continue;
    // }
    //TODO : vérifier si l'instance existe déjà
  }
  // isExist();


  // if (formConfig.value.some(field => field.validationError)) {
  //     return;
  // }

  const requestBody = getRequestBody(formConfig.value);
  if(requestBody instanceof FormData){
    if(requestBody.get("image") == "undefined") requestBody.set("image", "")
  }
  if(!isUpdateItem) {
    apiService.create(instance, requestBody)
        .then(res =>{
          afterInstanceSave()
        });
  }else {
    const itemId =  formConfig.value.find(field => field.name === 'id').value;
    apiService.update(instance, requestBody, itemId)
        .then(res =>{
          afterInstanceSave()
          unselectAllItems();
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

const stateOptions = {
  'Neuf': 1,
  'Occasion': 2,
  'Reconditionne': 3,
  'Seconde Main': 4
};

const openModalInstance = async (instance, isUpdate, data) => {
  isUpdateItem = isUpdate;
  if(isUpdateItem === false) {
    formConfig.value = getInstanceFormConfig(instance);
    if (instance === 'products') {
      await fetchOptions('brands', (data) => {
        const brandsField = formConfig.value.find(field => field.name === 'brands');
        brandsField.options = data;
      });
      await fetchOptions('categories', (data) => {
        const categoriesField = formConfig.value.find(field => field.name === 'categories');
        categoriesField.options = data;
      });
    }
    openModal();
    return;
  }
  else if(isUpdateItem === true){
    console.log("instance data", instance, data)
    apiService.getOne(instance, data)
        .then(data => {
          formConfig.value.filter(field => field.name === '_id').value = data.id ;
          getInstanceForm(instance, formConfig, data);
          openModal();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }else{
    if (confirm('Voulez-vous vraiment supprimer les élèments sélectionnés ?')) {
      forEach(data, (item) => {
        apiService.delete(instance, item)
            .then(res =>{
              afterInstanceSave()
            });
      });
    }
  }
};

const isExist = () => {
  const nameField = formConfig.value.find(field => field.name === 'name');
  apiService.getAll(instance, `name=${nameField.value}`)
      .then(res =>
      {
        if(res.length > 0) {
          nameField.validationError = { message: 'Ce nom existe déjà' };
        }
      })
}

const updatePrixHT = () => {
  const prixTTCField = formConfig.value.find(field => field.name === 'prixTTC');
  const tvasField = formConfig.value.find(field => field.name ===
      'tva');

  console.log("updateprixht : ", prixTTCField, tvasField)

  // const prixHT = prixTTC - (prixTTC * tva / 100);
  // formConfig.value.find(field => field.name === 'prixHT').value = prixHT.toFixed(2);
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
const pageIndex = reactive({
  limit: 10,
  currentPage: 1,
})

onMounted(async () => {
  formConfig.value = getInstanceFormConfig(instance);
  if(instance === 'products') {
    await fetchOptions('brands', (data) => {
      const brandsField = formConfig.value.find(field => field.name === 'brands');
      brandsField.options = data;
    });
    await fetchOptions('categories', (data) => {
      const categoriesField = formConfig.value.find(field => field.name === 'categories');
      categoriesField.options = data;
    });
  }
  await fetchListOfItems();
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