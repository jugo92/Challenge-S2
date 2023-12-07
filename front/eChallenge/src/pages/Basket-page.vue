<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import Navbar from "../components/Navbar.vue";
import {removeFromBasket, checkAndAddToBasket, basket} from "../services/basketService"

const store = useStore();
const router = useRouter();
const cart = computed(() => basket.value.products);
const loading = ref(false);

const imageUrl = `${import.meta.env.VITE_API_URL}/getImage/`

const decrementQuantity = (product) => {
  removeFromBasket(product);
};

const incrementQuantity = (product) => {
  checkAndAddToBasket(product, 1)
};

const total = computed(() => {
  return basket.value.products.reduce((acc, product) => {
    return acc + product.productData.price * product.quantity;
  }, 0).toFixed(2);
});
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
                                        <img class="h-16 w-16 mr-4" :src="`${imageUrl}${product.image}`" alt="Product image">
                                    </div>
                                </td>
                                <td class="py-4">{{ product.productData.price }}</td>
                                <td class="py-4">
                                    <div class="flex items-center">
                                        <button  @click="decrementQuantity(product.productData)" class="border rounded-md py-2 px-4 mr-2">-</button>
                                        <span class="text-center w-8">{{ product.quantity }}</span>
                                        <button @click="checkAndAddToBasket(product.productData)" class="border rounded-md py-2 px-4 ml-2">+</button>
                                    </div>
                                </td>
                                <td class="py-4">{{ product.productData.price * product.quantity }}</td>
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
                        <span class="font-semibold">{{ total }}</span>
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