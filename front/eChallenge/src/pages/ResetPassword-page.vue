<script setup>
import {useStore} from 'vuex';
import {ref} from 'vue';
import FormBuilder from '../components/Form/FormBuilder.vue';
import {z} from "zod";

const store = useStore();
const submitButtonText = 'Réinitialiser le mot de passe';
const email = ref('');

const onSubmit = async () => {
  try {
    const email = resetPasswordForm.value.find(field => field.type === 'email').value;
        const response = await fetch(`${import.meta.env.VITE_API_URL}/forget-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email
          }),
        });       
        router.push('/login');
    } catch (e) {
        console.error(e);
    }
};

const resetPasswordForm = ref([
    {
        label: "Email",
        type: "email",
        name: "email",
        value: email.value,
        placeholder: "Saisissez l'email de l'utilisateur...",
        required: true,
        validationError: "",
        validationSchema: z.string()
            .email({ message: "L'email n'est pas valide" })
            .min(3, { message: "L'email doit contenir au moins 3 caractères" })
            .max(255, { message: "L'email doit contenir au maximum 255 caractères" }),
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