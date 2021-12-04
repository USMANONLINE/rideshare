
const routes = [
  {
    path: '/',
    component: () => import('pages/Main.vue')
  }, {
    path: '/sign-in',
    name: 'Sign in',
    component: () => import('pages/sign-in.vue')
  }, {
    path: '/sign-up',
    name: 'Sign up',
    component: () => import('pages/sign-up')
  },

  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout'),
    children: [{
      path: '',
      name: 'Main',
      component: () => import('pages/Index.vue')
    }, {
      path: 'profile',
      name: 'Profile',
      component: () => import('pages/Profile')
    }, {
      path: 'trips',
      name: 'Trips',
      component: () => import('pages/Trips')
    }, {
      path: 'create-ride',
      name: 'Create Ride',
      component: () => import('pages/createRide')
    }]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
