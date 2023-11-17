<template>
  <!-- component -->
<nav class=" bg-white w-full flex relative justify-between items-center mx-auto px-8 h-20 navig">
    <!-- logo -->
    <div class="inline-flex">
        <a class="_o6689fn" href="/"
            ><div class="hidden md:block">
              <h1 class="text-2xl font-bold">Ô'PC</h1>
            </div>
            <div class="block md:hidden mobile">
              <h1 class="text-2xl font-bold">Ô'PC</h1>
            </div>
        </a>
    </div>

    <!-- end logo -->

    <!-- search bar -->
    <div class="hidden sm:block flex-shrink flex-grow-0 justify-start px-2">
    <div class="inline-block">
        <div class="inline-flex items-center max-w-full">
            <div class="flex items-center flex-grow-0 flex-shrink pl-2 relative w-60 border rounded-full px-1 py-1">
                <input type="text" placeholder="Rechercher" class="block flex-grow flex-shrink overflow-hidden outline-none px-2">
                <div class="flex items-center justify-center relative h-8 w-8 rounded-full">
                    <svg
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="presentation"
                        focusable="false"
                        style="
                            display: block;
                            fill: none;
                            height: 12px;
                            width: 12px;
                            stroke: currentcolor;
                            stroke-width: 5.33333;
                            overflow: visible;
                        "
                    >
                        <g fill="none">
                            <path
                                d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"
                            ></path>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</div>

    <!-- end search bar -->

    <!-- login -->
    <div class="flex-initial">
      <div class="flex justify-end items-center relative">
       
        <div class="flex mr-4 items-center">
         
          <div class="block relative">
            <RouterLink to="/cart">
              <button type="button" class="inline-block py-2 px-3 hover:bg-gray-200 rounded-full relative ">
                <div class="flex items-center h-5">
                  <div class="_xpkakx text-2xl">
                    <Icon icon="simple-line-icons:basket" />
                  </div>
                </div>
                <div v-if="quantity > 0" class="absolute top-0 right-0 bg-red-500 rounded-full h-4 w-4 text-white text-xs flex items-center justify-center">
                  {{ quantity }}
                </div>
              </button>
            </RouterLink>
          </div>
        </div>

        <div class="block">
            <div class="inline relative">

              <RouterLink to="/profile">
              
                <button type="button" class="inline-flex items-center relative px-2 border rounded-full hover:shadow-lg">
                    <div class="pl-1">
                        <svg
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            role="presentation"
                            focusable="false"
                            style="display: block; fill: none; height: 16px; width: 16px; stroke: currentcolor; stroke-width: 3; overflow: visible;"
                        >
                            <g fill="none" fill-rule="nonzero">
                                <path d="m2 16h28"></path>
                                <path d="m2 24h28"></path>
                                <path d="m2 8h28"></path>
                            </g>
                        </svg>
                    </div>

                    <div class="block flex-grow-0 flex-shrink-0 h-10 w-12 pl-5">
                        <svg
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            role="presentation"
                            focusable="false"
                            style="display: block; height: 100%; width: 100%; fill: currentcolor;"
                        >
                            <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path>
                        </svg>
                    </div>
                </button>
              </RouterLink>
            </div>
        </div>
      </div>
    </div>

</nav>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { RouterLink } from 'vue-router';
import {ref} from "vue"

const quantity = ref(1);
</script>


<style scoped>
.navig{
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebebeb;
}

@media screen and (max-width: 480px) {

  .navig {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;

  }
}

</style>
