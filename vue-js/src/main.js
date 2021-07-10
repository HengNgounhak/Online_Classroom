import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import VueCookies from 'vue3-cookies'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import router from './router'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Class from './components/Class.vue';
import Blur from './components/blur.vue';
import Btn from './components/Btn.vue';
import Profile from './components/Profile.vue';

library.add(fas);

createApp(App).use(router).use(store).use(VueCookies)
    .component("Profile", Profile)
    .component("btn", Btn)
    .component("Class", Class)
    .component("blur", Blur)
    .component("fa", FontAwesomeIcon)
    .mount('#app')