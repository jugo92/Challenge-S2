    /** src/router/index.js **/
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/notfound",
            name: "notfound",
            component: () => import("./../components/NotFound.vue"),
        },
        {
            path: "/login",
            name: "login",
            component: () => import("../components/Login.vue"),
        },
        {
            path: "/register",
            name: "register",
            component: () => import("../components/Register.vue"),
        },
        {
            path: "/dashboard",
            name: "hello",
            // params: { msg: "World" },
            component: () => import("./../components/HelloWorld.vue"),
        },
    ],
});

export default router;
