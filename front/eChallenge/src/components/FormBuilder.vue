<template>
    <form @submit.prevent="submitForm" class="mb-4 mt-12">
        <div v-for="(field, index) in fields" :key="index" class="mb-4" :class="{ 'flex flex-col': format === 'column' }">
            <label class="text-sm font-bold mb-1" :for="field.name" v-if="field.type !== 'checkbox'">
                {{ field.label }} <span class="text-red-600" v-if="field.required">*</span>
            </label>

            <component
                v-if="field.tag == 'input' && field.type !== 'checkbox'"
                v-model="modelValue[field.name]"
                :is="field.tag"
                :id="field.name"
                :type="field.type"
                :placeholder="field.placeholder"
                :required="field.required"
                :min="field.min"
                :max="field.max"
                @input="event => validateField(field, event)"
                :class="{
          'bg-transparent outline-none border border-gray-300 text-gray-400 text-sm rounded-lg p-2.5 w-full': field.tag == 'input',
          'block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500': field.tag == 'textarea',
        }"
            />

            <span v-if="field.tag === 'input' && field.type === 'checkbox'" class="space-x-2 flex items-center">
        <input
            :id="field.name"
            type="checkbox"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            v-model="field.isChecked"
        />

        <label :for="field.name" class="text-sm font-bold mb-1">
          {{ field.label }} <span class="text-red-600" v-if="field.required">*</span>
        </label>
      </span>

            <textarea
                v-else-if="field.tag === 'textarea'"
                :id="field.name"
                :placeholder="field.placeholder"
                :required="field.required"
                v-model="modelValue[field.name]"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                @input="event => validateField(field, event)"
                rows="4"
            ></textarea>

            <select
                v-else-if="field.tag === 'select'"
                v-model="modelValue[field.name]"
                :id="field.name"
                :required="field.required"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
                <option value="0" selected>Sélectionnez un(e) {{ field.label.toLowerCase() }}</option>

                <option v-if="field.apiOptions" v-for="element in field.apiOptions.data" :key="element.id" :value="element.id">{{ element.name }}</option>

                <option v-else-if="field.options" v-for="element in field.options" :key="element.value" :value="element.value">{{ element.label }}</option>
            </select>

            <div class="text-red-600" v-if="field.validationError">{{ field.validationError.message }}</div>

            <button
                v-if="field.tag === 'button'"
                :type="field.type"
                :class="{
          'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white font-bold py-2 px-4 rounded': field.buttonClass === 'primary',
          'bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white font-bold py-2 px-4 rounded': field.buttonClass === 'danger',
          'bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white font-bold py-2 px-4 rounded': field.buttonClass === 'success',
          'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white font-bold py-2 px-4 rounded': field.buttonClass === 'secondary',
        }"
            >
                <!-- Le contenu du bouton peut être ajouté ici -->
                {{ field.label }}
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import {ref, PropType, defineProps, defineEmits, onMounted} from 'vue';
import { z } from 'zod';

export interface Field {
    tag: string;
    type: string;
    label: string;
    name: string;
    placeholder?: string;
    required: boolean;
    isChecked?: boolean;
    buttonClass?: string;
    min?: number;
    max?: number;
    action?: () => void;
    options?: { value: number; label: string }[];
    apiOptions?: {
        url: string;
        method: string;
        data?: any[];
    };
    validationSchema?: z.ZodTypeAny;
    validationError: { message: string } | null;
}

const props = defineProps({
    fields: {
        type: Array as PropType<Field[]>,
        required: true,
    },
    modelValue: {
        type: Object as PropType<{ [key: string]: any }>,
        required: true,
    },
    format: {
        type: String as PropType<'row' | 'column'>,
        default: 'row',
    },
});

const emits = defineEmits();

const submitForm = () => {
    const formConfig = props.fields.find((field) => field.tag === 'button' && field.type === 'submit');

    if (formConfig && formConfig.action) {
        formConfig.action();
    }
};

import { inject } from 'vue';

const Vue = inject('Vue');

const validateField = (field, event) => {
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



onMounted(() => {
    props.fields.forEach((field) => {
        if (field.validationSchema) {
            const validationResult = field.validationSchema.safeParse(props.modelValue[field.name]);

            if (validationResult.success) {
                field.validationError = null;
            } else {
                field.validationError = validationResult.error;
            }
        }
    });
});
</script>