<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Search from './components/Search.vue'

</script>

<template>
  <div class="mb-5">
    <Navbar />
    <Search />
  </div>
  <div id="main-content">
    <router-view />
  </div>
</template>

<style scoped>

#main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background-color: #f9f9f9;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
