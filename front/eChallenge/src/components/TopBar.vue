<template>
    <div class="top">
      <ul>
        <li v-for="category in categories" :key="category.id"  class="font-bold" ">
          {{ category.name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue';

  
  const categories = ref([
    { id: 1, name: 'Bon plan' },
    {id:2, name:'reconditionné'},
    {id:3, name:'neuf'},
    {id:4, name:'occasion'},
    {id:5, name:'gratuit'},
  ]);

    const category = reactive({
        hover: false,
    });

    const toggleHover = () => {
        category.hover = !category.hover;
    };



  </script>
  
  <style>
  .top {
    background-color: #f3f4f6;
   border: solid 1px black;
    padding: 1rem
  }
  ul {
    display: flex;
    justify-content: space-around;
    list-style: none;
    padding: 0;
    cursor: pointer;
  }
  
 
  </style>