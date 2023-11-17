<template>
  <div class="carousel">
    <Carousel :autoplay="4000" :wrap-around="true">
    <Slide v-for="(image, index) in images" :key="index">
      <div class="carousel__item bg-white w-full h-80">
        <a href="#">
          <img :src="image.download_url" :alt="image.author">
        </a>
        
      </div>
    </Slide>
  </Carousel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

interface Image {
  id: string;
  author: string;
  download_url: string;
}

const images = ref<Image[]>([]);

const fetchImages = async () => {
  try {
    //on doit remplacer le lien par le lien de l'api
    const response = await fetch('https://picsum.photos/v2/list?page=1&limit=4');
    const data = await response.json();
    images.value = data;
  } catch (error) {
    console.error('Erreur lors de la récupération des images', error);
  }
};

onMounted(() => {
  fetchImages();
});
</script>


  <style scoped>
 
 img {

    width: 97%;
    height: 130%;
    justify-content: auto;
    margin-left: auto;
    margin-right: auto;
    border-radius: 8px 8px 0px 0px;

 }

 .carousel {
    margin-top: -2%;
 }

 .paginations {
 color: white;
 }

 @media screen and (max-width: 480px) {
    
    img {
        width: 95%;
        height: 60%;
        justify-content: auto;
        margin-left: auto;
        margin-right: auto;
    }

    .paginations {
       display: none;
    }
    
 }
    </style>