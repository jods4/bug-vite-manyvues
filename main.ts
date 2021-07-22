import { createApp } from "vue";
import App from "./app.vue";
import { router } from "./router";

// HACK: preserve the <svg> sprite container from vite-plugin-svg-sprite if it's inside <body> before the app is mounted.
const iconSvg = document.querySelector("svg");

createApp(App).use(router).mount(document.body);

if (iconSvg) document.body.append(iconSvg);