
<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import FormBuilder from '../components/FormBuilder.vue';
import Navbar from '../components/Navbar.vue';
import { loadStripe } from '@stripe/stripe-js';
import {useRouter} from 'vue-router';


const store = useStore();
const recapData = ref(null);
const router = useRouter();



onMounted(() => {
  recapData.value = store.state.recapData;
});

const submitButtonText = 'Payer';

const stripePromise = loadStripe('the key');



const onSubmit = async (data) => {
    const stripe = await stripePromise;

    if (!stripe) {
        console.error('La bibliothèque Stripe n\'a pas été correctement chargée.');
        return;
    }

    const elements = stripe.elements();

    const response = await fetch('http://localhost:3000/api/checkout', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        items: recapData.value.cart,
        address: data.address,
        zipcode: data.zipcode,
        city: data.city,
        address2: data.address2,
    }),
});

console.log('Réponse de l\'API :', response);

const {clientSecret} = await response.json();


    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
                address: {
                    city: data.city,
                    line1: data.address,
                    line2: data.address2,
                    postal_code: data.zipcode,
                },
            },
        },
    });

    if (error) {
        console.error(error);
    } else {
        if (paymentIntent.status === 'succeeded') {
            store.commit('clearCart');
            router.push('/success');
        }
    }
};

 
    


const form = ref({
  fields: [
    {
      type: 'text',
      label: 'Adresse',
      name: 'address',
      placeholder: 'ex: 1 rue de la paix',
      value: '',
      required: true,
    },
    {
      type: 'text',
      label: 'Code postal',
      name: 'zipcode',
      placeholder: 'ex: 75000',
      value: '',
      required: true,
    },
    {
      type: 'text',
      label: 'Ville',
      name: 'city',
      placeholder: 'ex: Paris',
      value: '',
      required: true,
    },
    {
      type: 'text',
      label: 'complément d\'adresse',
      name: 'address2',
      placeholder: 'facultatif',
      value: '',
      required: true,
    },
  ],
});
</script>





<template>
    <div>
      <Navbar />
      <div class="text-blue-500 mt-24">
        <a href="/" class="flex items-center space-x-2 px-8 py-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-gray-400 hover:text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.707 3.293a1 1 0 010 1.414L6.414 9H13a7 7 0 017 7v1a1 1 0 11-2 0v-1a5 5 0 00-5-5H6.414l4.293 4.293a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="text-sm text-gray-500 hover:text-gray-600">Retour vers la page d'accueil</span>
        </a>
      </div>
      <div class="min-h-screen flex items-center justify-center">
        <div class="w-full max-w-md p-4 md:p-8">
            <h1 class="text-2xl text-center mb-8 font-bold underline decoration-sky-500">Récapitulatif de votre commande</h1>
            <div class="bg-white overflow-hidden md:max-w-2xl mt-8 p-6 recap">
               
                <div v-if="recapData" class="recap_li">
                    <ul>
                    <li v-for="(item, index) in recapData.cart" :key="index" class="mb-4 border-b pb-4">
                        <p class="text-lg font-semibold">{{ item.Nom }}</p>
                      
                        <p class="text-gray-600 font-bold">État: {{ item.Etat }}</p>
                        <p class="text-gray-600">{{ item.description }}</p>
                        <p class="text-gray-600 font-bold">Prix: {{ item.Prix }}€</p>
                    </li>
                    <li class="mt-4 bg-gray-300">
                        <p class="text-xl font-semibold">Total: {{ recapData.total }}€</p>
                    </li>
                    </ul>
                </div>
                </div>
                <h2 class="text-2xl font-semibold mb-4 underline decoration-sky-500 text-center">Adresse de livraison</h2>
          <div class="form mt-4">
          
            <FormBuilder :form-config="form.fields" :on-submit="onSubmit" :button-text="submitButtonText" />
          </div>
        </div>
      </div>
    </div>
  </template>
  

  <style scoped>

        .recap{
            width: 1000px;
            margin-left: -30%;
            
           
        }

        .recap_li{

            margin-right: auto;
            margin-left: auto;
        }

        .form{
         
            border: solid 1px rgb(255, 255, 255);
            width: 150%;
            margin-left: -25%;
            margin-top: 5%;
        }

        @media screen and (max-width: 768px) {
            .recap{
                width: 100%;
                margin-left: 0%;
            }

            .form{
                width: 100%;
                margin-left: 0%;
            }
            
        }

    </style>