
 <template>

  <div>

    <div class="top ">
      <SliderImage />
    </div>
  </div>
  <div class="container">
      <ProductList />
    </div>

</template>

<script setup lang="ts">

import SliderImage from '../components/carousel/SliderImage.vue';
import ProductList from "../views/ProductList.vue";
import Navbar from '../components/Navbar.vue';

</script>

<style scoped>


.container {
 margin-left: auto;
 margin-right: auto;

}

.top{
  margin-top: 10%;
}

</style> 

