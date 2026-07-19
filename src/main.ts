import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import ui from "@nuxt/ui/vue-plugin";
import App from "./App.vue";
import { router } from "./router/index.ts";
import { userPlugin } from "./plugins/user.ts";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ui);
app.use(userPlugin);

app.mount("#app");
