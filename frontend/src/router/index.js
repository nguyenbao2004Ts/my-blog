import { createWebHashHistory, createRouter } from "vue-router";
import ComHome from "@/components/ComHome.vue";
import ComArticle from "@/components/ComArticle.vue";
import ComInformation from "@/components/ComInformation.vue";
import ComLogin from "../components/ComLogin.vue";
import ComRegister from "../components/ComRegister.vue";
import ComCreateArticle from "../components/ComCreateArticle.vue";
import ComUpdateArticle from "../components/ComUpdateArticle.vue";
import store from '../store';

const routes = [
  { path: "/", name: "Home", component: ComHome },
  { path: "/article/:id", name: "ArticleDetail", component: ComArticle },
  { path: "/about", name: "About", component: ComInformation },
  { path: "/login", component: ComLogin },
  { path: "/register", component: ComRegister },
  { 
    path: "/create-article", 
    name: "CreateArticle", 
    component: ComCreateArticle,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { 
    path: "/update-article/:id", 
    name: "UpdateArticle", 
    component: ComUpdateArticle, 
    props: true,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  const isAdmin = store.getters.isAdmin;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login');
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    alert('Bạn không có quyền truy cập trang này!');
    return next('/');
  }

  next();
});

export default router;
