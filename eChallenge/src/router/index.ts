    /** src/router/index.js **/
import { createRouter, createWebHistory } from "vue-router";
import RegisterVue from "../components/Register.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [

        {
            path: "/register",
            name: "Register",
            component: RegisterVue,
        },
   
    ],
});

export default router;
