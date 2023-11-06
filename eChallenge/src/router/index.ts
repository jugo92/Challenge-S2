    /** src/router/index.js **/
import { createRouter, createWebHistory } from "vue-router";
import RegisterVue from "../components/Register.vue";
import LoginVue from "../components/Login.vue";
import TestVue from "../components/testForm.vue";

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
        
    ],
});

export default router;
