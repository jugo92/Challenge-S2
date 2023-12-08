<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
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
    <Navbar/>
    <div id="app" class="pb-28">
            <router-view></router-view>
    <Footer class="fixed bottom-0 left-0"/>
    </div>
</template>

<style>
@import "./assets/styles.scss";

</style>