import { useTitle } from '@vueuse/core';
import {
  createRouter, createWebHistory, RouteLocationNormalized, RouteRecordRaw,
} from 'vue-router';
import PublicLayout from '@/layouts/PublicLayout.vue';
import AppLayout from '@/modules/layout/Index.vue';
import IdentityStore from '@/ts/stores/IdentityStore';
import Paths from './map';
import { setRefreshTokenTimer } from '../stores/RefreshToken';

function canSkip(toPath: string) {
  return toPath === Paths.UserLogin || toPath === Paths.UserNew;
}

const routes: Array<RouteRecordRaw> = [
  {
    path: Paths.Users,
    component: PublicLayout,
    children: [
      {
        name: 'user-signIn',
        path: 'sign-in',
        component: () => import(/* webpackChunkName: "login" */ '@/modules/login/Login.vue'),
        meta: {
          tabTitle: 'Systemis - Sign in',
        },
      },
      {
        path: 'sign-up',
        component: () => import(/* webpackChunkName: "register" */ '@/modules/login/Register.vue'),
        meta: {
          tabTitle: 'Systemis - Sign up',
        },
      },
    ],
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "notfound" */ '@/pages/NotFound.vue'),
  },
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "workbooks" */ '@/modules/browse/Browse.vue'),
        meta: {
          tabTitle: 'Workbooks',
        },
      },
      {
        name: 'workbook',
        path: ':id',
        component: () => import(/* webpackChunkName: "workbook" */ '@/modules/workbook/Workbook.vue'),
      },

      {
        path: Paths.New,
        component: () => import(/* webpackChunkName: "workbook-new" */ '@/modules/workbook/NewWorkbook.vue'),
        meta: {
          tabTitle: 'New Workbook',
        },
      },
      {
        path: 'edit/:id',
        component: () => import(/* webpackChunkName: "workbook-edit" */ '@/modules/workbook/EditWorkbook.vue'),
        meta: {
          tabTitle: 'Edit Workbook',
        },
      },
    ],
  },

  {
    path: Paths.CatchAll,
    component: () => import(/* webpackChunkName: "notfound" */ '@/pages/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

function UpdateTabTitle(to: RouteLocationNormalized) {
  if (to.meta?.tabTitle) {
    useTitle(to.meta?.tabTitle as string);
  }
}

router.beforeEach((to, _from, next) => {
  const store = new IdentityStore();
  const toPath = to.path;
  UpdateTabTitle(to);

  if (store.isAuthenticated()) {
    setRefreshTokenTimer();
    next();
  } else if (canSkip(toPath)) {
    next();
  } else {
    const query = toPath.toLocaleLowerCase() === '/sign-in' ? {} : { redirect: toPath };
    next({ name: 'user-signIn', query });
    useTitle('Systemis - Sign in');
  }
});

export default router;
