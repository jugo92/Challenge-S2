
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from "vue-router";
import { z } from "zod";
import Button from "./Button.vue";
import { useToast } from "vue-toast-notification";
import FormBuilder from "./Form/FormBuilder.vue";


const router = useRouter();
const toast = useToast();

const api = 'http://localhost:3000/api';

const submitForm = async () => {
    try {
        const response = await fetch(api + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname: registerForm.find(field => field.name === 'firstname').value,
                lastname: registerForm.find(field => field.name === 'lastname').value,
                gender: registerForm.find(field => field.name === 'gender').value,
                dateOfBirth: registerForm.find(field => field.name === 'dateOfBirth').value,
                email: registerForm.find(field => field.name === 'email').value,
                phone: registerForm.find(field => field.name === 'phone').value,
                address: registerForm.find(field => field.name === 'address').value,
                zip: registerForm.find(field => field.name === 'zip').value,
                city: registerForm.find(field => field.name === 'city').value,
                password: registerForm.find(field => field.name === 'password').value,
            })
        });



        if (response.ok) {
            const data = await response.json();
            if (!data.hasOwnProperty('error')) {
                router.push('/login');
                toast.success('Un email de confirmation vous a été envoyé');
            } else {
                toast.error('Une erreur est survenue');
                console.error('Erreur côté serveur :', data.error);
            }
        } else {
            toast.error('Une erreur est survenue lors de la requête');
            console.error('Erreur HTTP :', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Erreur lors de la requête POST :', error);
    }
};

const registerForm = reactive([
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
        label: "Confirmer le mot de passe",
        type: "password",
        name: "confirm_password",
        value: '',
        validationError: "",
    },

    {
        label:"J'accèpte les conditions générales d'utilisation",
        type: "checkbox",
        name: "acceptRules",
        value: false,
        required: true,
        changeHandlers: []
    },
    {
        type: 'button',
        label: 'Enregistrer',
        buttonType: 'button',
        buttonClass: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
        buttonClick: submitForm,
    },
    {
        name: "id",
    }
]);

</script>




<template>
        <div class="min-w-fit md:mx-20 lg:mx-52 my-16 mx-5 min-h-full flex justify-center mb-16">
            <div class="flex flex-col w-full justify-center items-center card">
                <span class="mt-8 text-2xl font-bold w-full text-center">Connectez-vous à votre compte</span>
                <FormBuilder :form-fields="registerForm" />
                <span class="w-full text-center">Pas encore de compte ? <router-link to="/register" class="underline text-blue-500 font-bold">S'inscrire </router-link> </span>
            </div>
        </div>
</template>



