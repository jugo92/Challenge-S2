<script setup lang="ts">
import Button from './Button.vue';
import FormBuilder from "./FormBuilder.vue";

const openModalProduct = () => {
    console.log("openModalProduct");
}

// const formConfig = [
//     {
//         type: 'text',
//         label: 'Nom (0/255)',
//         name: 'name',
//         placeholder: 'Entrez vle nom du produit',
//         required: true,
//     },
// ];

</script>

<template>
    <div class="flex flex-col gap-2">
        <span class="font-bold">Produits et services</span>
        <input class="w-full p-2 rounded bg-gray-100 text-black" type="password" placeholder="Rechercher dans la liste">
        <Button content="Nouveau Produit" color="green" @click="openModalProduct"/>
    </div>

    <div id="modalCreateProduct">
        <span>Nouveau produit</span>
        <!--        <FormBuilder on-submit="" form-config="" />-->
        <span>
            <span>Nom (0/255)</span>
            <input class="w-full p-2 rounded bg-gray-100 text-black" type="text" placeholder="Entrez le nom du produit">
        </span>
        <span>
        <span>Description (0/255)</span>
            <input class="w-full p-2 rounded bg-gray-100 text-black" type="text" placeholder="Entrez la description du produit">
        </span>
        <span>
            <span>Prix TTC</span>
            <input class="w-full p-2 rounded bg-gray-100 text-black" type="text" placeholder="Entrez le prix du produit">
        </span>
        <span></span>
    </div>
</template>

<style scoped>

</style>