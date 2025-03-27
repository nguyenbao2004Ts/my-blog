// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@fortawesome/fontawesome-free/css/all.css';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:4000';

const app = createApp(App);

app.use(store); // Phải đăng ký store trước router
app.use(router);

app.mount('#app');