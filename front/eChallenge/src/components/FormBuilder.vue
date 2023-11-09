<!--<template>-->
<!--    <form @submit.prevent="handleSubmit" class="mb-4 mt-12">-->
<!--        <div v-for="(field, index) in fields" :key="index" class="mb-4">-->
<!--            <label class="text-sm font-bold mb-1" :for="field.name">{{ field.label }} <span class="text-red-600" v-if="field.required">*</span></label>-->
<!--            <component-->
<!--                :is="field.type"-->
<!--                :id="field.name"-->
<!--                v-model="modelValue[field.name]"-->
<!--                :placeholder="field.placeholder"-->
<!--                :required="field.required"-->
<!--                :api-options="field.apiOptions"-->
<!--            />-->
<!--        </div>-->
<!--        <button type="submit" class="w-full p-2 rounded bg-blue-600 text-white mb-4">Inscription</button>-->
<!--    </form>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { ref, PropType, defineProps } from 'vue';-->

<!--interface Field {-->
<!--    type: string;-->
<!--    label: string;-->
<!--    name: string;-->
<!--    placeholder?: string;-->
<!--    required: boolean;-->
<!--    apiOptions?: {-->
<!--        url: string;-->
<!--        method: string;-->
<!--    };-->
<!--}-->

<!--const fields = ref<Field[]>([]);-->
<!--// const formData = ref<{ [key: string]: any }>({});-->
<!--const emits = defineEmits();-->
<!--const handleSubmit = () => {-->
<!--    // if (props.submitForm) {-->
<!--    //     props.submitForm(formData.value);-->
<!--    // }-->
<!--    if (props.modelValue) {-->
<!--        emits('update:modelValue', props.modelValue);-->
<!--    }-->
<!--};-->


<!--const props = defineProps({-->
<!--    fields: {-->
<!--        type: Array as PropType<Field[]>,-->
<!--        required: true,-->
<!--    },-->
<!--    modelValue: {-->
<!--        type: Object as PropType<{ [key: string]: any }>,-->
<!--        required: true,-->
<!--    },-->
<!--    // submitForm: Function as PropType<(data: { [key: string]: any }) => void>,-->
<!--});-->
<!--</script>-->

<template>
    <form @submit.prevent="handleSubmit" class="mb-4 mt-12">
        <div v-for="(field, index) in fields" :key="index" class="mb-4">
            <label class="text-sm font-bold mb-1" :for="field.name">{{ field.label }} <span class="text-red-600" v-if="field.required">*</span></label>
            <component
                :is="field.type"
                :id="field.name"
                v-model="modelValue[field.name]"
                :placeholder="field.placeholder"
                :required="field.required"
                :api-options="field.apiOptions"
                v-if="field.type !== 'select'"
            />
            <select
                v-if="field.type === 'select'"
                :id="field.name"
                v-model="modelValue[field.name]"
                :required="field.required"
            >
                <option value="" disabled>Choisissez une option</option>
                <option v-for="option in field.apiOptions.data" :key="option.id" :value="option.id">{{ option.name }}</option>
            </select>
        </div>
        <button type="submit" class="w-full p-2 rounded bg-blue-600 text-white mb-4">Inscription</button>
    </form>
</template>

<script setup lang="ts">
import {ref, PropType, defineProps, defineEmits, onMounted} from 'vue';

interface Field {
    type: string;
    label: string;
    name: string;
    placeholder?: string;
    required: boolean;
    apiOptions?: {
        url: string;
        method: string;
        data?: any[];
    };
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
});

const emits = defineEmits();

const handleSubmit = () => {
    if (props.modelValue) {
        emits('update:modelValue', props.modelValue);
    }
};

onMounted(() => {
    // Fetch data from the API and store it in apiOptions.data for select fields
    for (const field of props.fields) {
        if (field.type === 'select' && field.apiOptions) {
            fetch(`http://localhost:3000/api/${field.apiOptions.url}`)
                .then(response => response.json())
                .then(data => {
                    field.apiOptions.data = data;
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }
});
</script>
