import { createApp } from 'vue';
import './assets/styles.scss';
// import './dotenv.js';
import router from './router';
import App from './App.vue';
import ToastPlugin from "vue-toast-notification";
// import "vue-toast-notification/dist/theme-bootstrap.css";

const app = createApp(App)
    .use(router)
    .use(ToastPlugin, { position: "top" })
    .mount('#app')
