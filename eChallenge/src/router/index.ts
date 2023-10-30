    /** src/router/index.js **/
import { createRouter, createWebHistory } from "vue-router";
import RegisterVue from "../components/Register.vue";
import LoginVue from "../components/Login.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [

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
        
    ],
});

export default router;
