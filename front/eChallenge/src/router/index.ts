/** src/router/index.js **/
import { createRouter, createWebHistory } from "vue-router";
import RegisterVue from "../components/Register.vue";
import LoginVue from "../components/Login.vue";
import unauthorized from "../pages/unauthorized-page.vue";
import ShowAll from "../components/ShowAll.vue";
import ProductDetailsVue from "../views/ProductDetails.vue";
import ProductListVue from "../views/ProductList.vue";
import homePageVue from "../pages/home-page.vue";
import BasketPageVue from "../pages/Basket-page.vue";
import ProfilePageVue from "../pages/Profile-page.vue";
import SuccessPageVue from "../pages/Success-page.vue";
import SettingPageVue from "../pages/Setting-page.vue"
import ResetPasswordVue from "../pages/ResetPassword-page.vue"
import Dashboard from "../components/Dashboard.vue";
import UserDetails from "../components/Admin/User.vue";
import {useModal} from "./../components/Modal/useModal.ts";
import Recap from "../pages/Recap-page.vue";
import VerifyPassword from "../pages/VerifyPassword.vue";
import VerifyAccount from "../pages/Verify-page.vue";

const { isModalVisible, openModal, closeModal } = useModal();

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: homePageVue,
        },

        {
            path: "/profile",
            name: "Profile",
            component: ProfilePageVue,
        },

        {
            path: "/test",
            name: "ResetPassword",
            component: ResetPasswordVue,
        },
        {
            path: "/success",
            name: "Success",
            component: SuccessPageVue,
        },

        {
            path:"/setting",
            name:"setting",
            component:SettingPageVue,

        },

        {
            path: "/cart",
            name: "Basket",
            component: BasketPageVue,
        },
        {
            path: "/verify",
            name: "Verify",
            component: VerifyAccount,
        },
        {
            path: "/recap",
            name: "Recap",
            component: Recap,
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
            path: '/new_password',
            name: 'NewPassword',
            component: VerifyPassword,
        },
        {
            path: "/login",
            name: "Login",
            component: LoginVue,
        },
        {
            path: "/admin/dashboard",
            name: "Dashboard",
            component: Dashboard,
        },
        {
            path: '/admin/usercard/:id',
            name: 'UserDetails',
            component: UserDetails,
        },
        {
            path: "/admin/products",
            name: "ShowAllProducts",
            component: ShowAll,
            props: (route) => ({ instance: route.path.substring(1) })
        },
        {
            path: "/admin/brands",
            name: "ShowAllMarques",
            component: ShowAll,
            props: (route) => ({ instance: route.path.substring(1) })
        },
        {
            path: "/admin/categories",
            name: "ShowAllCategories",
            component: ShowAll,
            props: (route) => ({ instance: route.path.substring(1) })
        },
        {
            path: "/admin/users/",
            name: "ShowAllUsers",
            component: ShowAll,
            props: (route) => ({ instance: route.path.substring(1) })
        },
        {
            path: "/admin/refunds/",
            name: "ShowAllRefunds",
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

router.beforeEach((to, from, next) => {
    closeModal();
    next();
});

// router.beforeEach((to, from, next) => {
// const publicPages = ["/login", "/register"];
// const authRequired = !publicPages.includes(to.path);
// const loggedIn = localStorage.getItem("user");
//
// if (authRequired && !loggedIn) {
//     return next("/login");
// }
// console.log(to.path);
//     next();
// });

export default router;
