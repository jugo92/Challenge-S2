import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import ToastPlugin from 'vue-toast-notification';





const app = createApp(App);
app.use(ToastPlugin);
app.use(router);

app.mount('#app')
