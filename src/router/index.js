import { createRouter, createWebHistory } from "vue-router";
import CreateEventView from "../views/CreateEventView.vue";
import Login from "../pages/Login.vue";
import SignUp from "../pages/SignUp.vue";
import OrganizerSignup from "../pages/OrganizerSignup.vue";
const routes = [
  { path: "/create-event", name: "CreateEvent", component: CreateEventView },
  { path: "/signup", component: SignUp },
  { path: "/login", component: Login },
  { path: "/signupo", component: OrganizerSignup },
  {
    path: "/events",
    component: () => import("../views/events/EventBrowsingView.vue"),
  },
  {
    path: "/events/:eventId",
    component: () => import("../views/events/EventDetailView.vue"),
  },
  {
    path: "/admin",
    component: () => import("../views/Admin/Admindashboard.vue"),
    children: [
      {
        path: "pending",
        component: () => import("../views/Admin/Organizerspending.vue"),
      },
      {
        path: "organizers",
        component: () => import("../views/Admin/OrganizersAll.vue"),
      },
      {
        path: "organizer/:id",
        component: () => import("../views/Admin/OrganizerDetail.vue"),
      },
      {
        path: "users",
        component: () => import("../views/Admin/UsersManagement.vue"),
      },
      // { path: "", redirect: "admin" },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
