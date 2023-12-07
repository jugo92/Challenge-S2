<script setup>
import {useStore} from 'vuex';
import {ref} from 'vue';
import FormBuilder from '../components/Form/FormBuilder.vue';
import {z} from "zod";

const store = useStore();
const submitButtonText = 'Réinitialiser le mot de passe';

const onSubmit = async (data) => {
    try {
        await store.dispatch('resetPassword', data);
        router.push('/login');
    } catch (e) {
        console.error(e);
    }
};

const resetPasswordForm = ref([
    {
        label: "Mot de passe",
        type: "password",
        name: "password",
        value: '',
        validationError: "",
        validationSchema: z.string()
            .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
            .max(255, { message: "Le mot de passe doit contenir au maximum 255 caractères" }),
    },
    {
        label: "Confirmation du mot de passe",
        type: "password",
        name: "password_confirmation",
        value: '',
        validationError: "",
        validationSchema: z.string()
            .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
            .max(255, { message: "Le mot de passe doit contenir au maximum 255 caractères" }),
    },
    {
        type: 'button',
        label: 'Enregistrer',
        buttonType: 'button',
        buttonClass: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
        buttonClick: onSubmit,
    }
]);


</script>

<template>

    <div class="form">
        <div class="flex flex-col justify-center items-center card w-2/6">
            <FormBuilder :formFields="resetPasswordForm" />
        </div>
    </div>
</template>