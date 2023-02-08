import { RouteRecordRaw } from 'vue-router';

export const paths = {
  index: '',
  task: 'create',
};

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: paths.index,
        component: () => import('src/pages/IndexPages.vue'),
      },
      {
        path: paths.task,
        component: () => import('src/pages/TaskPage.vue'),
        
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
