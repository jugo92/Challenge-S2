<template>
  <div class="card">
  <FormBuilder :form-fields="formConfig" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {useStore} from 'vuex';
import FormBuilder from '../components/Form/FormBuilder.vue';
import {z} from "zod";

const store = useStore();
const messageSuccess = ref(false);
const user = ref(store.state.user || {});

const fetchUserData = async () =>{
  try{
    await store.dispatch('fetchUserData');
    user.data = { ...store.state.user };
  }catch(error){
    console.error(e);
  }
}

const getFormData = (data) => {
  formConfig.value.find(field => field.name === 'id').value = data.id;
  formConfig.value.find(field => field.name === 'firstname').value = data.firstname;
  formConfig.value.find(field => field.name === 'lastname').value = data.lastname;
    formConfig.value.find(field => field.name === 'gender').value = data.gender;
  formConfig.value.find(field => field.name === 'dateOfBirth').value = data.dateOfBirth;
  formConfig.value.find(field => field.name === 'email').value = data.email;
  formConfig.value.find(field => field.name === 'phone').value = data.phone;
  formConfig.value.find(field => field.name === 'address').value = data.address;
  formConfig.value.find(field => field.name === 'zip').value = data.zip;
  formConfig.value.find(field => field.name === 'city').value = data.city;
};

const fields = [

  {
    type: 'email',
    name: 'email',
    label: 'Email',
    placeholder: 'Votre adresse -mail',
    value: user.value.email,
  },

];

const submitButtonText = '';

const showResetPasswordPopup = () => {
  const resetPasswordPopup = document.getElementById('resetPasswordPopup');
  resetPasswordPopup.style.display = 'block';
};

const closeResetPasswordPopup = () => {
  const resetPasswordPopup = document.getElementById('resetPasswordPopup');
  resetPasswordPopup.style.display = 'none';
};

const fillFormData = () => {
  return {
    gender: formConfig.value.find(field => field.name == "gender").value,
    firstname: formConfig.value.find(field => field.name == "firstname").value,
    lastname: formConfig.value.find(field => field.name == "lastname").value,
    dateOfBirth: formConfig.value.find(field => field.name == "dateOfBirth").value,
    email: formConfig.value.find(field => field.name == "email").value,
    phone: formConfig.value.find(field => field.name == "phone").value,
    address: formConfig.value.find(field => field.name == "address").value,
    zip: formConfig.value.find(field => field.name == "zip").value,
    city: formConfig.value.find(field => field.name == "city").value,
    id: formConfig.value.find(field => field.name == "id").value,
  }
}

const updateSettings = async () => {
  try {
    await store.dispatch('updateSettings', user.value);
    messageSuccess.value = true;
  } catch (e) {
    console.error(e);
  }
};

const closeModal = () => {
  messageSuccess.value = false;
};

const toggleNotification = () => {
  showNotification(user.value.notifications);
};

const showNotification = (isActive) => {
  const notificationMessage = isActive ? 'Notifications activées' : 'Notifications désactivées';
  console.log(notificationMessage);
};

const envoyerDemandeResetPassword = async () => {
  const resetPasswordEmail = document.getElementById('resetPasswordEmail').value;

  console.log('Demande de réinitialisation de mot de passe envoyée pour :', resetPasswordEmail);
  closeResetPasswordPopup();
};

const formConfig = ref([
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
    type: 'button',
    label: 'Enregistrer',
    buttonType: 'button',
    buttonClass: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
    buttonClick: async () => {
      try {
        formData.value = fillFormData(user.data)
        await store.dispatch('updateUser', formData.value);
        messageSuccess.value = true;
      } catch (e) {
        console.error(e);
      }
    },
  },
  {
    label: "id",
    name: "id",
    value: "",
    showCondition: () => false,
  }
]);

const formData = ref()
onMounted(() => {
  fetchUserData()
      .then(() => {
        getFormData(user.data);
      })
      .catch((error) => {
        console.error(error);
      })
});
</script>

<style scoped>
@import "./../assets/styles.css";

/*------ Settings ------*/
.container {
  --color: crimson;
  --size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  font-size: var(--size);
  user-select: none;
  fill: var(--color);
  margin-left: auto;
  margin-right: auto;


}

.modal-conten{
  margin-left: auto;
  margin-right: auto;
  background-color: red;
}

.input_reset{
  color: red;
}

.container .bell-regular {
  position: absolute;
  animation: keyframes-fill .5s;
  width: 20%;

}

.container .bell-solid {
  position: absolute;
  display: none;
  animation: keyframes-fill .5s;
}

/* ------ On check event ------ */
.container input:checked ~ .bell-regular {
  display: none;
}

.container input:checked ~ .bell-solid {
  display: block;
}

/* ------ Hide the default checkbox ------ */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;

}
.cloche{
  border: 1px solid rgb(231, 226, 226);
  justify-content: center;
  background-color: rgb(247, 247, 247);
  border-radius: 20px;
  width: 10%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.cloche:hover{
  cursor: pointer;
  background-color: white;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  padding-top: 60px;
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

/* ------ Animation ------ */
@keyframes keyframes-fill {
  0% {
    opacity: 0;
  }

  25% {
    transform: rotate(25deg);


  }

  50% {
    transform: rotate(-20deg) scale(1.2);

  }

  75% {
    transform: rotate(15deg);

  }
}

@media screen and (max-width: 480px) {
  @keyframes keyframes-fill {
    0% {
      opacity: 0;
    }

    25% {
      transform: rotate(25deg);



    }

    50% {
      transform: rotate(-20deg) scale(1.2);


    }

    75% {
      transform: rotate(15deg);

    }
  }

}
</style>
  