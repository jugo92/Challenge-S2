
 <template>
      <TopBar />
  <div>

    <div class="mt-12">
      <SliderImage />
    </div>
    <ProductList />
  </div>
  <div class="container">
    <ProductList />
  </div>

</template>

<script setup lang="ts">

import TopBar from '../components/TopBar.vue';
import SliderImage from '../components/carousel/SliderImage.vue';
import ProductList from "../views/ProductList.vue";

</script>

<style scoped>


.container {
  display: flex;
 margin-left: auto;
 margin-right: auto;

}

</style> 

