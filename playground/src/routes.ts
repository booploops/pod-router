import { h, ref, defineComponent, shallowRef } from 'vue';
import type { Route } from '../../src/types';

const routes = shallowRef<Route[]>([
  {
    path: '/',
    name: 'Home',
    component: h('div', { style: 'padding: 20px;' }, [
      h('h1', 'Home'),
      h('p', 'Welcome to <pod-router>!'),
    ])
  },
  {
    path: '/about',
    name: 'About',
    // Lazy-loaded component using dynamic import
    component: () => import('./ComponentPage.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: h('div', { style: 'padding: 20px;' }, [
      h('h1', 'Dashboard'),
      h('p', 'Main dashboard page. Try the nested routes:'),
      h('ul', [
        h('li', '/dashboard/stats - View statistics'),
        h('li', '/dashboard/settings - View settings'),
        h('li', '/dashboard/profile/:id - View profile'),
      ])
    ]),
    children: [
      {
        path: '/stats',
          name: 'DashboardStats',
          component: h('div', { style: 'padding: 20px;' }, [
          h('h1', 'Dashboard - Statistics'),
          h('p', 'This is a nested route under /dashboard'),
          h('p', { style: 'font-weight: bold;' }, 'Full path: /dashboard/stats'),
        ])
      },
      {
        path: '/settings',
          name: 'DashboardSettings',
          component: h('div', { style: 'padding: 20px;' }, [
          h('h1', 'Dashboard - Settings'),
          h('p', 'This is a nested route under /dashboard'),
          h('p', { style: 'font-weight: bold;' }, 'Full path: /dashboard/settings'),
        ])
      },
      {
        path: '/profile/:id',
        name: 'DashboardProfile',
        component: defineComponent({
          props: ['id'],
          setup(props) {
            return () => h('div', { style: 'padding: 20px;' }, [
              h('h1', 'Dashboard - Profile'),
              h('p', 'This is a nested route with params under /dashboard'),
              h('p', { style: 'font-weight: bold;' }, `Full path: /dashboard/profile/${props.id}`),
              h('p', `Profile ID: ${props.id}`),
            ])
          }
        })
      }
    ]
  },
  {
    path: '/user/:id',
    name: 'User',
    component: defineComponent({
      props: ['id'],
      setup(props) {
        return () => h('div', { style: 'padding: 20px;' }, [
          h('h1', 'User Profile'),
          h('p', `User ID: ${props.id}`),
        ])
      }
    })
  },
  {
    path: '*',
    name: 'NotFound',
    component: h('div', { style: 'padding: 20px;' }, [
      h('h1', '404 - Not Found'),
      h('p', 'The page you are looking for does not exist.'),
    ])
  }
])

export default routes;