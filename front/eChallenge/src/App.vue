<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

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

