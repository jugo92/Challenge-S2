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
const { reinitForm, validateField, handleFileChange, listFormData } = useForm()

const instance = window.location.pathname.substring(1);
let isUpdateItem = ref(null);

import {apiService} from "../services/apiService.ts";


//////////////////////////////////
///   DEFINITION DES DONNEES  ///
////////////////////////////////
const getTableColumns = (instance) => {
    switch (instance){
        case 'products':
            return [
                { key: 'name', label: 'Nom', filter: true, style: 'font-bold' },
                { key: 'category', label: 'Catégorie', filter: true },
                { key: 'brands', label: 'Marque', filter: true },
                { key: 'price', label: 'Prix', filter: true },
                { key: 'quantity', label: 'Quantité', filter: true },
                { key: 'state', label: 'État', filter: true },
                { key: 'promotion', label: 'Promotion', filter: true },
                { key: 'tva', label: 'TVA', filter: true },
                { key: 'isPublished', label: 'Est Publié', filter: true },
            ];
        case 'marques':
            return [
                { key: 'name', label: 'Nom', filter: true, style: 'font-bold' },
                { key: 'description', label: 'Description', filter: true, style: 'font-bold' },
                { key: 'image', label: 'Image', filter: true },
            ];
        case 'categories':
            return [
                { key: 'name', label: 'Nom', filter: true, style: 'font-bold' },
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
            return ['id', 'name', 'Category.name', 'Marque.name', 'price', 'quantity', 'state', 'promotion', 'tva', 'isPublished'];
        case 'marques':
            return ['id', 'name', 'description', 'image'];
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
            const formProduct = new FormData();
            formProduct.append('file', formConfig.find(field => field.name === 'files').value)
            formProduct.append('CategoryId', formConfig.find(field => field.name === 'categories').value)
            formProduct.append('MarqueId', formConfig.find(field => field.name === 'brands').value)
            formProduct.append('CaracteristiqueId', "018c0d75-1908-7d35-accb-6a22d6c617b8")
            formProduct.append('TvaId', '018c0d73-2021-7eab-a6a2-193a0a78cab8')
            formProduct.append('name',  formConfig.find(field => field.name === 'name').value)
            formProduct.append('description', formConfig.find(field => field.name === 'description').value)
            formProduct.append('quantity', formConfig.find(field => field.name === 'quantite').value)
            formProduct.append('price', formConfig.find(field => field.name === 'prixTTC').value)
            formProduct.append('deliveryDate', 0)
            formProduct.append('state',formConfig.find(field => field.name === 'state').value)
            formProduct.append('promotion', selectedPromotion.id || 0)
            formProduct.append('image', formConfig.find(field => field.name === 'files').value.name)
            return formProduct
        case "marques":
            const formMarque = new FormData();
            formMarque.append('file', formConfig.find(field => field.name === 'files').value)
            formMarque.append('name', formConfig.find(field => field.name === 'name').value)
            formMarque.append('description', formConfig.find(field => field.name === 'description').value)
            formMarque.append('image', formConfig.find(field => field.name === 'files').value.name)
            return formMarque
        case "categories":
            return {
                name: formConfig.find(field => field.name === 'name').value,
                description: formConfig.find(field => field.name === 'description').value,
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
            formConfig.value.find(field => field.name === 'description').value = data ? data.description : '';
            break;
        case 'categories':
            formConfig.value.find(field => field.name === 'id').value = data ? data.id : null;
            formConfig.value.find(field => field.name === 'name').value = data ? data.name : '';
            formConfig.value.find(field => field.name === 'description').value = data ? data.description : '';
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
                    label: 'TVA (%)',
                    type: 'number',
                    name: 'tva',
                    value: '0',
                    min: 0,
                    max: 50,
                    required: true,
                    changeHandlers: [updatePrixHT],
                    validationError: '',
                    validationSchema: z.number()
                        .min(0, { message: 'La TVA doit être supérieure à 0' })
                        .max(50, { message: 'La TVA doit être inférieure à 50' }),
                    showCondition: () => true
                },
                {
                    label: 'Publier',
                    type: 'checkbox',
                    name: 'isPublished',
                    isChecked: false,
                    showCondition: () => true
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
                    label: "Caméra Arrière",
                    type: "text",
                    name: "backcamera",
                    value: "",
                    placeholder: "Saisissez la qualité de la caméra arrière...",
                    required: true,
                    validationError: "",
                    validationSchema: z.string()
                        .min(3, { message: "La caméra arrière doit contenir au moins 3 caractères" })
                        .max(255, { message: "La caméra arrière doit contenir au maximum 255 caractères" }),
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
                    name: "accessories",
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
                    label: 'Description',
                    type: 'text',
                    name: 'description',
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
                    label: 'Ajouter une ou plusieurs images',
                    type: 'file',
                    name: 'images',
                    showCondition: () => true
                },
                {
                    name: 'files',
                    value: 'test'
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
        const tab = data.map((item) => {
            const filteredItem = {};
            for (const property of includedProperties) {
                if(property.includes('.')){
                    filteredItem[property] = item[property.split('.')[0]][property.split('.')[1]] || ''
                }
                else  {
                    filteredItem[property] = item[property] || '';
                }
            }
            return filteredItem;
        });
        return tab
    } catch (error) {
        console.error('Erreur lors de la récupération des produits depuis l\'API', error);
    }
};

const updateTableData = async () => {
    const data = await fetchListOfItems();
    tableData.value = data;
};

// watch(() => tableData.value, () => {
//     fetchListOfItems();
// })

const afterInstanceSave = () => {
    isModalVisible.value = false;
    tableData.value = fetchListOfItems();
}

const createInstance = async (data) => {
    console.log("createInstance formconfig", formConfig )
    console.log("createInstance listFormData", listFormData )
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
        // if(await isExistingProduct() && !formConfig.id) {
        //   field.validationError = { message: 'Ce produit existe déjà' };
        //   return;
        // }
    }


    // if (formConfig.value.some(field => field.validationError)) {
    //     return;
    // }

    const requestBody = getRequestBody(formConfig.value);
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
const openModalCreate = async (instance, isUpdate, data) => {
    isUpdateItem = isUpdate;
    if(!isUpdateItem) {
        formConfig.value = getInstanceFormConfig(instance);
        if (instance === 'products') {
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
        }
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
    // if(instance === 'products') {
    //     await fetchOptions('marques', (data) => {
    //         // marques.value = data;
    //         const brandsField = formConfig.value.find(field => field.name === 'brands');
    //         brandsField.options = data;
    //     });
    //     await fetchOptions('tvas', (data) => {
    //         const tvasField = formConfig.value.find(field => field.name === 'tvas');
    //         tvasField.options = data;
    //     });
    //     await fetchOptions('categories', (data) => {
    //         const categoriesField = formConfig.value.find(field => field.name === 'categories');
    //         categoriesField.options = data;
    //     });
    // }
    // await fetchListOfItems();
    updateTableData()
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