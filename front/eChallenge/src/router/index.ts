/** src/router/index.js **/
import { createRouter, createWebHistory } from "vue-router";
import RegisterVue from "../components/Register.vue";
import LoginVue from "../components/Login.vue";
import TestVue from "../components/TestForm.vue";
import unauthorized from "../pages/unauthorized-page.vue";
import Products from "../components/Products.vue";
import HomePage from "../pages/home-page.vue";


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
        //
        // {
        //     path: "/test",
        //     name: "Test",
        //     component: TestVue,
        // },

        {
            path: "/unauthorized",
            name: "Unauthorized",
            component: unauthorized,
        },

        {
            path: "/products",
            name: "Products",
            component: Products,
        }

    ],
});

export default router;
