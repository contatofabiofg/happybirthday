import { createRouter, createWebHistory } from '@ionic/vue-router'

const routes = [
  { path: '/login', component: () => import('@/views/Login.vue') },
  {
    path: '/',
    component: () => import('@/views/Menu.vue'),
    redirect: '/login',
    children: [
      {
        path: 'dashboard',
        component: () => import('../components/Dashboard.vue'),
      },
      {
        path: 'cadastro',
        component: () => import('../components/Cadastro.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
