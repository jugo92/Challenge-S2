<template>
    <div class="max-w-md mx-auto mt-4 p-6 bg-gray-100 rounded-md">
        <form @submit.prevent="createProduct">
            <div v-for="(field, index) in formFields" :key="index" class="mb-4">
                <template v-if="field.type !== 'button'">
                    <!-- Label -->
                    <template v-if="field.type === 'label' && showField(field)">
                        <label :for="field.name" class="block text-gray-700 text-sm mb-2">
                            <b>{{ field.label }}</b>&nbsp; {{ field.value }} €
                        </label>
                    </template>
                    <template v-else-if="showField(field)">
                        <label :for="field.name" class="block text-gray-700 text-sm font-bold mb-2">{{ field.label }} <span class="text-red-600" v-if="field.required">*</span></label>
                    </template>

                    <!-- Input Text -->
                    <template v-if="(field.type === 'text' || field.type === 'email') && showField(field)">
                        <input
                            :type="field.type"
                            :id="field.name"
                            :name="field.name"
                            v-model="field.value"
                            @input="callChangeHandlers(field.changeHandlers); handleInput(field)"
                            :required="field.required"
                            :placeholder="field.placeholder"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </template>

                    <!-- Input Number -->
                    <template v-else-if="field.type === 'number' && showField(field)">
                        <input
                            :type="field.type"
                            :id="field.name"
                            :name="field.name"
                            v-model="field.value"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            @input="callChangeHandlers(field.changeHandlers)"
                        />
                    </template>

                    <!-- Select Promotion -->
                    <template v-else-if="field.type === 'select' && field.optionsType === 'static' && field.name === 'promotion' && showField(field)">
                        <select
                            :id="field.name"
                            :name="field.name"
                            v-model="field.value"
                            @change="callChangeHandlers(field.changeHandlers)"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="" disabled selected>Sélectionnez une promotion</option>
                            <option v-for="(option, optionIndex) in field.options" :key="optionIndex" :value="option.id">
                                {{ option.name }}
                            </option>
                        </select>
                    </template>

                    <!-- Select Static -->
                    <template v-else-if="field.type === 'select' && field.optionsType === 'static' && showField(field)">
                        <select
                            :id="field.name"
                            :name="field.name"
                            v-model="field.value"
                            @change="callChangeHandlers(field.changeHandlers)"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="0" :selected="!field.value">Sélectionnez un(e) {{ field.label.toLowerCase() }}</option>
                            <option v-for="(option, optionIndex) in field.options" :key="optionIndex" :value="option.id">
                                {{ option.name }}
                            </option>
                        </select>
                    </template>

                    <!-- Select Dynamic -->
                    <template v-else-if="field.type === 'select' && field.optionsType === 'dynamic' && showField(field)">
                        <select :id="field.name" :name="field.name" v-model="field.value"
                                @change="callChangeHandlers(field.changeHandlers)"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <option value="0" selected>Sélectionnez un(e) {{ field.label.toLowerCase() }}</option>
                            <option v-for="(option, optionIndex) in field.options" :key="optionIndex" :value="option[field.valueKey]">
                                {{ option[field.labelKey] }}
                            </option>
                        </select>
                    </template>

                    <!-- Search -->
                    <template v-else-if="field.type === 'search'">
                        <input
                            :type="field.type"
                            :id="field.name"
                            :name="field.name"
                            v-model="field.value"
                            @input="callChangeHandlers(field.changeHandlers)"
                            @focus="callChangeHandlers(field.changeHandlers)"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            :placeholder="field.placeholder"
                        />
                        <div v-if="field.suggestions.length > 0" class="suggestions">
                            <div v-for="(suggestion, index) in field.suggestions" :key="index" @click="selectSuggestion(field, suggestion)">
                                {{ suggestion.name }}
                            </div>
                        </div>
                    </template>

                    <!-- Textarea -->
                    <template v-else-if="field.type === 'textarea' && showField(field)" @input="callChangeHandlers(field.changeHandlers)">
                        <textarea :id="field.name" :name="field.name" v-model="field.value" :required="field.required" :placeholder="field.placeholder" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                    </template>

                    <!-- Checkbox -->
                    <template v-else-if="field.type === 'checkbox' && showField(field)">
                        <input :type="field.type" :id="field.name" :name="field.name" v-model="field.isChecked" class="mr-2 leading-tight">
                        <label :for="field.name" class="text-sm">{{ field.label }}</label>
                    </template>

                    <!-- Error message -->
                    <div class="text-red-600" v-if="field.validationError">{{ field.validationError.message }}</div>
                </template>
            </div>

            <!-- Buttons -->
            <template v-for="(button, buttonIndex) in formFields" :key="buttonIndex" class="w-full">
                <button
                    v-if="button.type === 'button' && showField(button)"
                    :type="button.buttonType"
                    :class="button.buttonClass"
                    @click.prevent="button.buttonClick()"
                    class="mr-2"
                >
                    {{ button.label }}
                </button>
            </template>
        </form>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted, Ref, watch} from 'vue';
import { z } from 'zod';

export interface FormField {
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number' | 'label' | 'button' | 'search' | 'checkbox' | 'email';
    name: string;
    value?: string | number;
    placeholder?: string;
    min?: number;
    max?: number;
    required?: boolean;
    isChecked?: boolean;
    suggestions?: any[];
    showCondition?: () => boolean;
    optionsType?: 'static' | 'dynamic';
    options?: any[];
    labelKey?: string;
    valueKey?: string;
    changeHandlers?: (() => void)[];
    readonly?: boolean;
    buttonType?: 'button' | 'submit';
    buttonClass?: string;
    buttonClick?: () => void;
    validationSchema?: z.ZodTypeAny;
    validationError: { message: string } | null;
}

const createProduct = () => {
    // Logique de gestion de la sauvegarde
    console.log('Données sauvegardées !', formFields.value);

    const promotionField = formFields.value.find(field => field.name === 'promotion');
    const selectedPromotion = promotionField.options.find(option => option.id === promotionField.value);

    const requestBody = {
        nom: formFields.value.find(field => field.name === 'name').value,
        description: formFields.value.find(field => field.name === 'description').value,
        prix: formFields.value.find(field => field.name === 'prixTTC').value,
        quantite: formFields.value.find(field => field.name === 'quantite').value,
        idTVA: formFields.value.find(field => field.name === 'tvas').value,
        idModel: formFields.value.find(field => field.name === 'models').value,
        brandId: formFields.value.find(field => field.name === 'brands').value,
        promotion: selectedPromotion.value,
    };

    fetch('http://localhost:3000/api/products/createVersion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody), // Convertir l'objet en chaîne JSON
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

const reinitForm = () => {
    // Logique de réinitialisation des valeurs du formulaire
    console.log('Formulaire réinitialisé !');
};

const updatePrixHT = () => {
    const prixTTCField = formFields.value.find(field => field.name === 'prixTTC');
    const tvasField = formFields.value.find(field => field.name === 'tvas');
    const selectedTva = tvasField.options.find(option => option.id === tvasField.value);

    const prixTTC = prixTTCField.value || 0;
    const tva = selectedTva ? selectedTva.taux : 0;

    const prixHT = prixTTC - (prixTTC * tva / 100);
    formFields.value.find(field => field.name === 'prixHT').value = prixHT.toFixed(2);
};

const updatePrixTTCAfterPromotion = () => {
    const promotionField = formFields.value.find(field => field.name === 'promotion');
    const selectedPromotion = promotionField.options.find(option => option.id === promotionField.value);

    const prixTTCField = formFields.value.find(field => field.name === 'prixTTC');
    const prixTTC = prixTTCField.value || 0;

    const prixTTCAfterPromotion = (1 - selectedPromotion.value / 100) * prixTTC;
    formFields.value.find(field => field.name === 'prixTTCAfterPromotion').value = prixTTCAfterPromotion.toFixed(2);
};

const callChangeHandlers = (changeHandlers) => {
    if (changeHandlers && Array.isArray(changeHandlers)) {
        for (const handler of changeHandlers) {
            if (typeof handler === 'function') {
                handler();
            }
        }
    }
};

const fetchOptions = async () => {
    // Faire un appel API pour récupérer la liste d'options
    try {
        const response = await fetch('http://localhost:3000/api/marques');
        const data = await response.json();
        formFields.value.find(field => field.name === 'brands').options = data;

        const response2 = await fetch('http://localhost:3000/api/modeles');
        const data2 = await response2.json();
        formFields.value.find(field => field.name === 'models').options = data2;

        const response3 = await fetch('http://localhost:3000/api/tvas');
        const data3 = await response3.json();
        formFields.value.find(field => field.name === 'tvas').options = data3;
    } catch (error) {
        console.error('Erreur lors de la récupération des options depuis l\'API', error);
    }
};

const marques = ref([]);
const modeles = ref([]);

const fetchMarques = async () => {
    // Faire l'appel API pour obtenir toutes les marques
    try {
        const response = await fetch('http://localhost:3000/api/marques');
        const data = await response.json();
        marques.value = data;
    } catch (error) {
        console.error('Erreur lors de la récupération des marques', error);
    }
};

const fetchModeles = async () => {
    // Faire l'appel API pour obtenir tous les modèles
    try {
        const response = await fetch('http://localhost:3000/api/modeles');
        const data = await response.json();
        modeles.value = data;
    } catch (error) {
        console.error('Erreur lors de la récupération des modèles', error);
    }
};

const filterMarques = () => {
    const searchField = formFields.value.find((field) => field.name === 'brands' && field.type === 'search');
    const inputValue = searchField.value;

    searchField.suggestions = marques.value.filter(
        (marque) => marque.name.toLowerCase().includes(inputValue)
    );
};

const filterModels = () => {
    const searchField = formFields.value.find((field) => field.name === 'models' && field.type === 'search');
    const inputValue = searchField.value;
    console.log(inputValue);

    searchField.suggestions = modeles.value.filter(
        (modele) => modele.name.toLowerCase().includes(inputValue)
    );
};

const selectSuggestion = (field, suggestion) => {
    const searchField = field;
    searchField.value = suggestion.name;
    searchField.suggestions = [];
};

const showField = (field) => {
    return !field.showCondition || (field.showCondition && field.showCondition());
};

const handleInput = async (field) => {
    await validateField(field);
};


const validateField = async (field) => {
    const zodField = field.validationSchema;

    if (zodField) {
        const validationResult =
            field.type === 'checkbox'
                ? zodField.safeParse(event.target.checked)
                : zodField.safeParse(event.target.value);

        // Utilisez la méthode Vue.set pour mettre à jour le modèle de manière réactive
        // Cela garantit que les changements sont suivis par Vue
        Vue.set(props.modelValue, field.name, event.target.value);

        if (validationResult.success) {
            field.validationError = null;
        } else {
            field.validationError = { message: validationResult.error.errors[0].message };
        }
    }
};


const formFields: Ref<FormField[]> = ref([
    {
        label: 'Nom',
        type: 'text',
        name: 'name',
        value: '',
        placeholder: 'Saisissez le nom du produit...' ,
        required: true,
        validationError: '',
        validationSchema: z.string()
            .min(1)
            .max(50)
            .refine(value => value !== '', { message: 'Le nom du produit est obligatoire' })
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
            .min(1)
            .max(500)
            .refine(value => value !== '', { message: 'La description du produit est obligatoire' }),
        showCondition: () => true
    },
    {
        label: 'Marque',
        type: 'search',
        name: 'brands',
        value: '',
        placeholder: 'Saisissez le nom de la marque...',
        required: true,
        suggestions: [],
        changeHandlers: [filterMarques],
        showCondition: () => true,
    },
    { label: 'Modèle',
        type: 'search',
        name: 'models',
        value: '',
        placeholder: 'Saisissez le nom du modèle...',
        required: true,
        suggestions: [],
        showCondition: () => true,
        changeHandlers: [filterModels]
    },
    {
        label: 'Quantite',
        type: 'number',
        name: 'quantite',
        value: 0, min: 0,
        required: true,
        showCondition: () => true
    },
    {
        label: 'Prix TTC',
        type: 'number',
        name: 'prixTTC',
        value: 0,
        min: 0,
        max: 9999,
        required: true,
        changeHandlers: [updatePrixHT, updatePrixTTCAfterPromotion],
        showCondition: () => true
    },
    {
        label: 'TVA (%)',
        type: 'select',
        name: 'tvas',
        value: '',
        optionsType: 'dynamic',
        options: [],
        labelKey: 'taux',
        valueKey: 'id',
        required: true,
        changeHandlers: [updatePrixHT],
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
            { id: '1', name: '10 % (dix pourcent)', value: 10 },
            { id: '2', name: '20 % (vingt pourcent)', value: 20 },
            { id: '3', name: '30 % (trente pourcent)', value: 30 },
            { id: '4', name: '40 % (quarante pourcent)', value: 40 },
            { id: '5', name: '50 % (cinquante pourcent)', value: 50 },
            { id: '6', name: '60 % (soixante pourcent)', value: 60 },
            { id: '7', name: '70 % (soixante-dix pourcent)', value: 70 },
            { id: '8', name: '80 % (quatre-vingt pourcent)', value: 80 },
            { id: '9', name: '90 % (quatre-vingt-dix pourcent)', value: 90 },
            { id: '10', name: '100 % (cent pourcent)', value: 100},
        ],
        showCondition: () => true,
},
    {
        label: 'Prix TTC après promotion',
        type: 'label',
        name: 'prixTTCAfterPromotion',
        value: '0.00',
        readonly: true,
        showCondition: () => formFields.value.find(field => field.name === 'promotion').value !== '' },
    {
        type: 'button',
        label: 'Enregistrer',
        buttonType: 'button',
        buttonClass: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
        buttonClick: createProduct,
        showCondition: () => true
    },
    {
        type: 'button',
        label: 'Réinitialiser',
        buttonType: 'button',
        buttonClass: 'bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
        buttonClick: reinitForm,
        showCondition: () => true },
]);

onMounted(() => {
    fetchOptions();
    fetchMarques();
    fetchModeles();
    for (const field of formFields.value) {
        if (field.validationSchema) {
            watch(() => field.value, async () => {
                await validateField(field);
            });
        }
    }
});
</script>

<style scoped>
.suggestions {
    position: absolute;
    background-color: white;
    border: 1px solid #e0e0e0;
    max-height: 150px;
    overflow-y: auto;
    z-index: 1;
}
.suggestions div {
    padding: 8px;
    width: 155px;
    cursor: pointer;
}
.suggestions div:hover {
    background-color: #eaeaea;
}
</style>
