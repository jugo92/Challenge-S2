// eventBus.js
import { createApp } from 'vue';

const app = createApp({});
const eventBus = app.config.globalProperties.$emitter = app;
export default eventBus;
