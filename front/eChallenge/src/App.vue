<script setup lang="ts">
import Navbar from './components/Navbar.vue';

</script>

<template>
    <div id="app">
        <Navbar />
<!--    <TopBar />-->
        <div class="min-w-fit my-20 md:mx-20 lg:mx-52 m-5">
            <router-view></router-view>
        </div>
    </div>
</template>

