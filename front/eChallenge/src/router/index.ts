/** src/router/index.js **/
import { createRouter, createWebHistory } from "vue-router";
import RegisterVue from "../components/Register.vue";
import LoginVue from "../components/Login.vue";
import TestVue from "../components/TestForm.vue";
import unauthorized from "../pages/unauthorized-page.vue";
import Products from "../components/Products.vue";
import HomePage from "../pages/home-page.vue";
import ShowAll from "../components/ShowAll.vue";


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: HomePage,
        },
        {
            path: "/register",
            name: "Register",
            component: RegisterVue,
        },
        {
            path: "/login",
            name: "Login",
            component: LoginVue,
        },
        {
            path: "/products",
            name: "ShowAllProducts",
            component: ShowAll,
            props: (route) => ({ instance: route.path.substring(1) })
        },
        {
            path: "/marques",
            name: "ShowAllMarques",
            component: ShowAll,
            props: (route) => ({ instance: route.path.substring(1) })
        },
        {
            path: "/categories",
            name: "ShowAllCategories",
            component: ShowAll,
            props: (route) => ({ instance: route.path.substring(1) })
        },
        {
            path: "/users",
            name: "ShowAllUsers",
            component: ShowAll,
            props: (route) => ({ instance: route.path.substring(1) })
        },
        {
            path: "/unauthorized",
            name: "Unauthorized",
            component: unauthorized,
        }
    ],
});

export default router;
