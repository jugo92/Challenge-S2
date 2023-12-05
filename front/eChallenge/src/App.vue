<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import {onMounted, provide} from "vue";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

onMounted(() => {
    const instance = window.location.pathname.substring(1)
    provide('instance', instance)
});
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
