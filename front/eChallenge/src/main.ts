import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ToastPlugin from 'vue-toast-notification';
import "./assets/styles.css";
import store from './composable/store';



const app = createApp(App);
app.use(ToastPlugin);
app.use(router);
app.use(store);

app.mount('#app');
