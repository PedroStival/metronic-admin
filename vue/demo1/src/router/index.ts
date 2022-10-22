import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import store from "@/store";
import { Mutations } from "@/store/enums/StoreEnums";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/clientes",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "/clientes",
        name: "clientes",
        component: () => import("@/views/empresa/Empresas.vue"),
      },
      {
        path: "/auditoria-interna/:empresaId",
        name: "AuditoriaInterna",
        component: () => import("@/views/empresa/AuditoriaInterna.vue"),
      },
      {
        path: "/manual-qualidade/:empresaId",
        name: "ManualQualidade",
        component: () => import("@/views/empresa/ManualQualidade.vue"),
      },
      {
        path: "/clientes",
        name: "EmpresasAdmin",
        component: () => import("@/views/empresa/Empresas.vue"),
      },
      {
        path: "/documentos/:empresaId",
        name: "Documentos",
        component: () => import("@/views/empresa/Documentos.vue"),
      },
      {
        path: "/documentos-capitulo/:empresaId/:capituloId",
        name: "DocumentosCapitulo",
        component: () => import("@/views/empresa/DocumentosCapitulo.vue"),
      },
      // },
      {
        path: "/documentos-item/:empresaId/:itemId",
        name: "DocumentosItem",
        component: () => import("@/views/empresa/DocumentosItem.vue"),
      },
      {
        path: "/documentos-subitem/:empresaId/:subitemId",
        name: "DocumentosSubItem",
        component: () => import("@/views/empresa/DocumentosSubItem.vue"),
      },
    ],
  },
  {
    path: "/manual/:empresaId",
    name: "Manual",
    component: () => import("@/views/empresa/Manual.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/empresa/auth/SignIn.vue"),
  },
  {
    path: "/password-reset",
    name: "password-reset",
    component: () => import("@/views/empresa/auth/PasswordReset.vue"),
  },
  {
    // the 404 route, when none of the above matches
    path: "/404",
    name: "404",
    component: () => import("@/views/crafted/authentication/Error404.vue"),
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/views/crafted/authentication/Error500.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(() => {
  // reset config to initial state
  store.commit(Mutations.RESET_LAYOUT_CONFIG);

  // store.dispatch(Actions.VERIFY_AUTH);

  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

export default router;
