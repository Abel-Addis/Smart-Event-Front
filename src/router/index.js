import { createRouter, createWebHistory } from "vue-router";
import CreateEventView from "../views/CreateEventView.vue";
import Login from "../pages/Login.vue";
import SignUp from "../pages/SignUp.vue";

const routes = [
  { path: "/create-event", name: "CreateEvent", component: CreateEventView },
  { path: "/signup", component: SignUp },
  { path: "/login", component: Login },
  // add your other routes (login, dashboard, etc.)
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
