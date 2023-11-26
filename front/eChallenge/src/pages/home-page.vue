
 <template>
  <div>
   <Navbar />
    </div>
      <TopBar />
  <div>

    <div class="mt-12 ">
      <SliderImage />
    </div>
  </div>
  <div class="container">
      <ProductList />
    </div>

</template>

<script setup lang="ts">

import TopBar from '../components/TopBar.vue';
import SliderImage from '../components/carousel/SliderImage.vue';
import ProductList from "../views/ProductList.vue";
import Navbar from '../components/Navbar.vue';

</script>

<style scoped>


.container {
 margin-left: auto;
 margin-right: auto;

}

</style> 

