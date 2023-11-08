<script setup lang="ts">
import Navbar from './components/Navbar.vue';
// import TopBar from './components/TopBar.vue';


</script>

<template>
  <div id="app">
    <Navbar />
<!--    <TopBar />-->
    <router-view></router-view>
  </div>
</template>

