<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import Navbar from "../components/Navbar.vue";
import { Icon } from '@iconify/vue';
import LoaderPc from "../components/loader/LoaderPc.vue";

const store = useStore();
const router = useRouter();
const cart = computed(() => store.state.cart);
const loading = ref(false);


onMounted(() => {
  const storedCart = JSON.parse(localStorage.getItem('cart'));
  if (storedCart) {
    store.commit('setCart', storedCart);
  }
});

const total = computed(() => {
  return cart.value.reduce((acc, product) => acc + (product.total || 0), 0);
});

const updateQuantity = (product, increment) => {
  if (increment) {
    product.total = (product.total || 0) + product.price;
  } else {
    product.total = Math.max(0, (product.total || 0) - product.price);
  }
  if (product.total === 0) {
    removeProduct(product);
  }
  updateProductExpiration(product);
};

const increaseQuantity = (product) => {
  product.total = (product.total || 0) + product.price;
  updateProductExpiration(product);
};

const decreaseQuantity = (product) => {
  product.total = Math.max(1, (product.total || 1) - product.price);
  if (product.total === 1) {
    removeProduct(product);
  }
  updateProductExpiration(product);
};

const removeProduct = (product) => {
  store.commit('removeFromCart', product);
  saveCartToLocalStorage();
};

const saveCartToLocalStorage = () => {
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

const updateProductExpiration = (product) => {
  const expirationTime = new Date().getTime() + 15 * 60 * 1000;
  product.expirationTime = expirationTime;

  localStorage.setItem(`product_${product.id}_expiration`, expirationTime.toString());
};

const checkProductExpiration = (product) => {
  const currentTime = new Date().getTime();
  const storedExpirationTime = localStorage.getItem(`product_${product.id}_expiration`);

  if (storedExpirationTime && currentTime > parseInt(storedExpirationTime)) {
    removeProduct(product);
    localStorage.removeItem(`product_${product.id}_expiration`);
  }
};


const goToRecap = () => {
  loading.value = true; 
  console.log(cart.value);
  
  const recapData = {
    cart: cart.value,
    total: total.value,
  };

  setTimeout(() => {
    store.commit('setRecapData', recapData);
    router.push('/recap_order');
    loading.value = false; 
  }, 2000);
};



</script>



 <template>
  <Navbar />

<div class=" h-screen py-8 mt-24 mobile_first">
    <div class="container mx-auto px-4">
        <h1 class="text-2xl font-semibold mb-4">Panier</h1>
        <div class="flex flex-col md:flex-row gap-4">
            <div class="md:w-3/4">
                <div class="bg-white rounded-lg shadow-md p-6 mb-4">
                    <table class="w-full mobile_table">
                        <thead>
                            <tr>
                                <th class="text-left font-semibold">Produit</th>
                                <th class="text-left font-semibold">Prix</th>
                                <th class="text-left font-semibold">Quantité</th>
                                <th class="text-left font-semibold">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, index) in cart" :key="index" class="space-y-4">
                                <td class="py-4">
                                    <div class="flex items-center">
                                        <img class="h-16 w-16 mr-4" :src="product.image" alt="">
                                        <span class="font-semibold"> {{ product.name }}</span>
                            
                                    </div>
                                </td>
                                <td class="py-4">{{product.price}}€</td>
                                <td class="py-4">
                                <div class="flex items-center">

                                    <button @click="() => decreaseQuantity(product)" class="border rounded-md py-2 px-4 mr-2">-</button>
                                    <span class="text-center w-8">{{ (product.total || 0) / product.price }}</span>
                                    <button @click="() => increaseQuantity(product)" class="border rounded-md py-2 px-4 ml-2">+</button>
                                    <button @click="() => removeProduct(product)" class="border rounded-md py-2 px-4 ml-2 text-red-500">
                                      <Icon icon="material-symbols:delete-outline" />
                                    </button>

                                </div>
                                 </td>
                                <td class="py-4">{{product.total}} €</td>
                            </tr>
                       
                        </tbody>
                    </table>
                </div>

                <div v-if="loading" class="loader">
                   <LoaderPc />
              </div>
            </div>
            <div class="md:w-1/4">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-lg font-semibold mb-4">Résumé</h2>
                   
                    <hr class="my-2">
                    <div class="flex justify-between mb-2">
                        <span class="font-semibold">Total</span>
                        <span class="font-semibold">{{ total }}€</span>
                    </div>
                    <button @click="goToRecap" :disabled="loading" class="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full cursor-pointer">Paiement</button>

                </div>
            </div>
        </div>
    </div>
</div>
 </template>

 <style scoped>

  .loader{
    margin-left: 50%;
    margin-top: 10%;
  }

 @media screen and (max-width: 768px) {
  .mobile_first{
    margin-top: 0%;
  }
  .filtre{
    margin-left: 0%;
  }
  .icon{
    margin-left: 0%;
  }
  .mobile{
    margin-left: 0%;
  }
  .mobile{
    margin-left: 0%;
  }

  .mobile_table{

    margin-left: 0%;
    margin-right: 0%;



  }

  
 }

 </style>