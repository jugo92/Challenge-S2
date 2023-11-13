/** src/router/index.js **/
import { createRouter, createWebHistory } from "vue-router";
import RegisterVue from "../components/Register.vue";
import LoginVue from "../components/Login.vue";
import TestVue from "../components/TestForm.vue";
import unauthorized from "../pages/unauthorized-page.vue";
import Products from "../components/Products.vue";
import HomePage from "../pages/home-page.vue";
import ShowAll from "../components/ShowAll.vue";
import ProductDetailsVue from "../views/ProductDetails.vue";
import ProductListVue from "../views/ProductList.vue";
import homePageVue from "../pages/home-page.vue";


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: homePageVue,
        },
        {
            path: "/products",
            name: "ProductList",
            component: ProductListVue,
        },

        {
            path: "/products/:id",
            name: "ProductDetails",
            component: ProductDetailsVue,

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
        },
        // {
        //     path: "/products/:id",
        //     name: "ProductDetails",
        //     component: ProductDetailsVue,
        // },
      
        
    ],
});

export default router;
