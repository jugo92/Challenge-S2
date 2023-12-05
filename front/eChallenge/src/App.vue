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
 <!--   <TopBar />-->
        <div >
            <router-view></router-view>
        </div>
    </div>
</template>

