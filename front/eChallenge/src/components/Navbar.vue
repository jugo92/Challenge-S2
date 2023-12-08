<template>
    <div class="min-h-full">
        <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 items-center justify-between">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <img class="h-8 w-8" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
                        </div>
                        <div class="hidden md:block">
                            <div class="ml-10 flex items-baseline space-x-4">
                                <a v-for="item in navigation.values()" :key="item.name" :href="item.href" :class="[item.key == instance ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium']" :aria-current="item.current ? 'page' : undefined" @click="console.log(item)">{{ item.name }}</a>
                            </div>
                        </div>
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-4 flex items-center md:ml-6">
                            <div class="block relative">
                                <RouterLink to="/cart">
                                    <button type="button" class="inline-block py-2 px-3 relative ">
                                        <div class="flex items-center h-5">
                                            <div class="_xpkakx text-2xl">
                                                <Icon icon="vaadin:cart" color="white"/>
                                            </div>
                                        </div>
                                        <div v-if="quantity > 0" class="absolute top-0 right-0 bg-red-500 rounded-full h-4 w-4 text-white text-xs flex items-center justify-center">
                                            {{ quantity }}
                                        </div>
                                    </button>
                                </RouterLink>
                            </div>

                            <!-- Profile dropdown -->
                            <Menu as="div" class="relative ml-3">
                                <div>
                                    <MenuButton class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                        <span class="absolute -inset-1.5" />
                                        <span class="sr-only">Open user menu</span>
                                    </MenuButton>
                                </div>
                                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                                    <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                                            <a :href="item.href" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">{{ item.name }}</a>
                                        </MenuItem>
                                    </MenuItems>
                                </transition>
                            </Menu>
                        </div>
                    </div>
                    <div class="-mr-2 flex md:hidden">

                        <!-- Mobile menu button -->
                        <DisclosureButton class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span class="absolute -inset-0.5" />
                            <span class="sr-only">Open main menu</span>
                            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
                            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
                        </DisclosureButton>
                    </div>
                </div>
            </div>

            <DisclosurePanel class="md:hidden">
                <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                    <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton>
                </div>
                <div class="border-t border-gray-700 pb-3 pt-4">
                    <div class="flex items-center px-5">
                        <div class="ml-3">
                            <div class="text-base font-medium leading-none text-white">{{ user.name }}</div>
                            <div class="text-sm font-medium leading-none text-gray-400">{{ user.email }}</div>
                        </div>
                        <div class="block relative">
                            <RouterLink to="/cart">
                                <button type="button" class="inline-block py-2 px-3 hover:bg-gray-200 rounded-full relative ">
                                    <div class="flex items-center h-5">
                                        <div class="_xpkakx text-2xl">
                                            <Icon icon="vaadin:cart" color="white" />
                                        </div>
                                    </div>
                                    <div v-if="quantity > 0" class="absolute top-0 right-0 bg-red-500 rounded-full h-4 w-4 text-white text-xs flex items-center justify-center">
                                        {{ quantity }}
                                    </div>
                                </button>
                            </RouterLink>
                        </div>
                    </div>
                    <div class="mt-3 space-y-1 px-2">
                        <DisclosureButton v-for="item in userNavigation" :key="item.name" as="a" :href="item.href" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">{{ item.name }}</DisclosureButton>
                    </div>
                </div>
            </DisclosurePanel>
        </Disclosure>

        <header class="bg-white shadow" v-if="$route.path.includes('admin')">
            <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <h1 class="text-3xl font-bold tracking-tight text-gray-900" v-if="instance == 'dashboard'"> Tableau de bord </h1>
                <h1 class="text-3xl font-bold tracking-tight text-gray-900" v-else-if="!$route.path.split('/').includes('usercard')"> Gestion des {{ navigation.find((item) => item.key == instance).name.toLowerCase() || '' }} </h1>
            </div>
        </header>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { RouterLink } from 'vue-router';
import {inject, onMounted, ref} from "vue"
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import {checkIsRouteAdmin} from "./utils.ts";

const isRouteAdmin = ref();
const quantity = ref(1);
const instance = ref();

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com'
}
const navigation = ref(
    (() => {
        // switch ($route.path.include("admin")) {
        //     case true:
                return [
                    { key: "dashboard", name: 'Tableau de bord', href: 'http://localhost:5173/admin/dashboard', current: true },
                    { key: "users", name: 'Utilisateurs', href: 'http://localhost:5173/admin/users', current: false },
                    { key: "categories", name: 'Catégories', href: 'http://localhost:5173/admin/categories', current: false },
                    { key: "brands", name: 'Marques', href: 'http://localhost:5173/admin/brands', current: false },
                    { key: "products", name: 'Produits', href: 'http://localhost:5173/admin/products', current: false },
                    { key: "refunds", name: 'Remboursements', href: 'http://localhost:5173/admin/refunds', current: false }
                ];
        //     case false:
        //         return [
        //             { key: "bureautique", name: 'Bureautique', click: '/bureautique'},
        //             { key: "ultra-portable", name: 'Ultra-portable', click: '/ultra-portable'},
        //             { key: "gaming", name: 'Gaming', click: '/gaming'},
        //             { key: "professionels", name: 'Professionnels', click: '/accessoires'},
        //             { key: "pc-fixe", name: 'PC fixe', click: '/pc-fixe'},
        //             { key: "gaming", name: 'Gaming', click: '/gaming'},
        //         ]
        //     default:
        //         return [];
        // }
    })()
);


const userNavigation = [
    { name: 'Mon profil', href: '#' },
    { name: 'Paramètre', href: '#' },
    { name: 'Se déconnecter', href: '#' },
]

onMounted(() => {
    try {
        isRouteAdmin.value = checkIsRouteAdmin();
        const splitUrl = window.location.pathname.split("/");
        instance.value = splitUrl[splitUrl.length - 1];
    } catch (error) {
        console.error("Erreur lors de l'exécution de onMounted :", error);
    }
});
</script>

<style scoped>
.navig {
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    border: 1px solid #ebebeb;
}

.mobile_nav{
    display: none;
}

@media screen and (max-width: 480px) {

    .mobile_nav{
        display: flex;
        position: fixed;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        border: 1px solid #ffffff;
        background-color: #fff;
        margin-top: 20%;


    }
}
</style>
