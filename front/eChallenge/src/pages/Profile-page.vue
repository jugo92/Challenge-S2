<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter, RouterLink } from 'vue-router';
import { useStore } from 'vuex';
import { format } from 'date-fns';


const router = useRouter();
const store = useStore();
const showDeleteConfirmation = ref(false);
const user = ref(store.state.user || {});
const orders = ref([]);
const products = ref([]);
const sortOrder = ref('asc');
const notifications = ref([]);



const reimburseProduct = async (product) => {
  try {
    await store.dispatch('reimburseProduct', product);
    console.log('Produit remboursé avec succès');
  } catch (error) {
    console.error('Erreur lors du remboursement du produit:', error);
  }
};
const filterOrders = () => {
  let filtered = orders.value;

  if (selectedDate.value) {
    const filterDate = format(selectedDate.value, 'yyyy-MM-dd');
    filtered = filtered.filter(order => format(new Date(order.createdAt), 'yyyy-MM-dd') === filterDate);
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(order => order.status === selectedStatus.value);
  }

  filteredOrders.value = filtered;
};

const handleCheckboxChange = async (notification) => {
  try {
    const isChecked = !notification.checked;
    await store.dispatch('updateNotificationUserRelation', { notificationId: notification.id, isChecked });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la relation notification-utilisateur :', error);
  }
};

const disconnect = () => {
  store.dispatch('logout');
  router.push('/login');
};

const confirmDelete = () => {
  console.log('Suppression du compte');
  showDeleteConfirmation.value = false;
};

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
};

const downloadPDF = () => {
  console.log('Téléchargement du PDF');
};

const addToCart = async (product) => {
    store.commit('addToCart', product);
    console.log('Product added to cart:', product);
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-400';
    case 'Validate':
      return 'bg-green-300';
    case 'Canceled':
      return 'bg-red-500';
    case 'Partiel_Refund':
      return 'bg-purple-500';
    case 'Refund':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');

    if (token) {
      store.commit('setToken', token);

      if (store.state.isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (user) {
          store.commit('setUser', user);
          store.commit('setReimburdeProduct', reimburseProduct);

    
          await store.dispatch('fetchNotifications');

          orders.value = store.state.orders;
          notifications.value = store.state.notifications;
        } else {
          console.error('User data not found in local storage.');
        }

        await store.dispatch('fetchOrders');
        orders.value = store.state.orders;
      }
    } else {
      console.warn('Token not found in local storage. Redirecting to login.');
      router.push('/login');
    }
  } catch (error) {
    console.error('An error occurred during component initialization:', error);
  }
   filterOrders();
});




</script>


<template>


<div class="">
 <div class="w-full text-white bg-main-color mt-12">
    <h2 class="text-black font-bold flex ml-4 underline decoration-sky-500"><Icon icon="uil:setting" class="text-2xl"/>Paramètres du compte de {{user.firstname}}</h2>

    </div>
    <!-- End of Navbar -->

    <div class="container mx-auto my-5 p-5">
        <div class="md:flex no-wrap md:-mx-2 ">
            <!-- Left Side -->
            <div class="w-full md:w-3/12 md:mx-2 left_side">
                <!-- Notification card -->
                <div class="bg-white p-3 border-t-4 border-blue-400">
                    <h1 class="text-gray-900 font-bold text-xl leading-8 my-1 flex text-center underline decoration-sky-500">
                         les notifications <Icon icon="mdi:bell" class="text-2xl text-yellow-500 rotate-60"/>
                    </h1>
                    <div class="mt-4"> 
                        <div v-for="notification in notifications" :key="notification.id" class="flex items-center mb-4">
                            <input 
                                :id="`checkbox-${notification.id}`" 
                                type="checkbox" 
                                v-model="notification.checked"
                                @change="handleCheckboxChange(notification)" 
                                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label :for="`checkbox-${notification.id}`" class="ms-2 text-sm font-medium text-gray-900 bg-gray-200 w-full rounded-xl font-bold">
                                {{ notification.name }}
                            </label>
                        </div>               
                        </div>
                </div>
            
            </div>
            <!-- Right Side -->
            <div class="w-full md:w-9/12 mx-2 h-64">
                <!-- Profile tab -->
                <!-- About Section -->
                <div class="bg-white p-3 shadow-sm rounded-sm  border-t-4 border-blue-100 information">
                    <div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8 underline decoration-sky-500">
                        <span clas="text-green-500 text-3xl underline decoration-sky-500">
                            <svg class="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </span>
                        <span class="tracking-wide text-2x">À propos</span>
                    </div>
                    <div class="text-gray-700 ">
                        <div class="grid md:grid-cols-2 text-sm">
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Prénom :</div>
                                <div class="px-4 py-2">{{ user.firstname }}</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Nom :</div>
                                <div class="px-4 py-2">{{ user.lastname }}</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Sexe :</div>
                                <div class="px-4 py-2">{{ user.gender }}</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Tél :</div>
                                <div class="px-4 py-2">{{ user.phone }}</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Addresse :</div>
                                <div class="px-4 py-2">{{ user.address }}</div>
                            </div>
                            
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Email :</div>
                                <div class="px-4 py-2">
                                    <p class="text-black">{{ user.email }}</p>
                                </div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Code postal :</div>
                                <div class="px-4 py-2">{{ user.zip }}</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Date de naissance :</div>
                                <div class="px-4 py-2">{{ user.dateOfBirth }}</div>
                            </div>
                           
                        </div>
                    </div>
                    
                    <button
                        class="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">
                       Modifier mes informations</button>
                       
                </div>
                
                <!-- End of about section -->

                <div class="my-4">
                </div>

                <!-- Addresse historique-->
                <div class="bg-white p-3 shadow-sm rounded-sm  border-t-4 border-blue-400 historique_adrresse">

                    <div class="">
                        <div>
                            <div class="flex items-center space-x-2 font-semibold text-gray-900 mb-3">
                                <span clas="text-green-500">
                                    <Icon icon="material-symbols-light:history" class="text-3xl font-bold" />
                                </span>
                                <span class="underline decoration-sky-500 text-2xl">Les historique de mes commandes</span>
                            </div>
                            <div class="flex">
                                  
                            </div>
                            <ul class="text-center">
                                <li v-if="orders.length > 0" v-for="order in orders" :key="order.id" class="flex">
                                    <div class="text-teal-600 text-xs">
                                        <div v-if="order.Products && order.Products.length > 0" class="block w-full text-teal-600 text-sm font-semibold rounded-lg focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">
                                            {{ order.Products[0].name }}
                                        </div>
                                        <div v-else class="block w-full text-teal-600 text-sm font-semibold rounded-lg focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">
                                            Aucun produit disponible
                                        </div>
                                    </div>
                                    <div class="text-gray-500 text-xs">
                                        <button @click="addToCart(order.Products[0])" class="block w-full text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4 text-xs">
                                            Commander à nouveau
                                        </button>
                                    </div>
                                    <div class="text-gray-500 text-xs">
                                        <button @click="reimburseProduct(order.Products[0])" class="block w-full text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4 text-xs">
                                        Retourner le produit
                                        </button>
                                    </div>
                                    
                                    <div class="text-center">
                                        <button @click="downloadPDF"
                                            class="block w-full text-xs text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">
                                            <Icon icon="humbleicons:download" class="text-2xl" />
                                        </button>
                                    </div>
                                    <div class="text-gray-500 text-xs mt-4">
                                        <div :class="`block text-sm rounded-full ${getStatusColor(order.status)} focus:outline-none focus:shadow-outline  -p-2 my-4 text-xs text-black mt-4`">
                                            {{ order.status }}
                                        </div>
                                    </div>

                                </li>
                                <li v-else>
                            Aucune commande trouvée.
                            </li>
                                
                            </ul>
                         </div>
                       
                    </div>
                    <!-- End of Experience and education grid -->
                </div>
                <!-- End of profile tab -->
            </div>
        </div>
    </div>
</div>

   
</template>

<style scoped>
    :root {
        --main-color: #4a76a8;
    }

    .bg-main-color {
        background-color: var(--main-color);
    }

    .text-main-color {
        color: var(--main-color);
    }

    .border-main-color {
        border-color: var(--main-color);
    }

    .rotate-60 {
        transform: rotate(340deg);
    }

    @media screen and (max-width: 480px) {

        .information {
          margin-top: 12%;
          width: 100%;
        }

        .historique_adrresse {
          width: 100%;
        }
        .left_side{
          width: 100%;
        }

        .mobile_first{
         width: 100%;
        }
        
    }

    
</style>

