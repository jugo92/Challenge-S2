<script setup lang="ts">
import Navbar from './components/Navbar.vue';


</script>

<template>
    <div id="app">
        <Navbar />
        <div class="m-5">
            <router-view></router-view>
        </div>
    </div>
</template>

