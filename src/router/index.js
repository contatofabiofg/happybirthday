import { createRouter, createWebHistory } from '@ionic/vue-router'

const routes = [
  { path: '/login', component: () => import('@/views/Login.vue') },
  {
    path: '/signin',
    component: () => import('../views/SignIn.vue'),
  },
  {
    path: '/',
    component: () => import('@/views/Menu.vue'),
    redirect: '/login',
    children: [
      {
        path: 'home',
        component: () => import('../components/Home.vue'),
      },
      {
        path: 'person',
        component: () => import('../components/Person.vue'),
      },
      {
        path: 'person/:id',
        component: () => import('../components/Person.vue'),
      },
      {
        path: 'recipes/:category',
        component: () => import('../components/Recipes.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
