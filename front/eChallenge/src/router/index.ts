    /** src/router/index.js **/
import { createRouter, createWebHistory } from "vue-router";
import RegisterVue from "../components/Register.vue";
import LoginVue from "../components/Login.vue";
import TestVue from "../components/TestForm.vue";
import unauthorized from "../pages/unauthorized-page.vue";


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
            
            {
                path: "/test",
                name: "Test",
                component: TestVue,
            },

        {
            path: "/unauthorized",
            name: "Unauthorized",
            component: unauthorized,
        },
        
    ],
});

export default router;
