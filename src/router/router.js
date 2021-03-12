const Mainchildren = [
  {
    path: '/home',
    alias:'/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/Menu.vue')
  },
  {
    path: '/shoppingcar',
    name: 'ShoppingCar',
    component: () => import('../views/ShoppingCar.vue')
  },
  {
    path: '/me',
    name: 'Me',
    component: () => import('../views/Me.vue')
  },
]

export const routes = [
    
    {
      path: '/',
      name: 'Main',
      component: () => import('../views/Main.vue'),
      children:Mainchildren
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    
    {
      path: '/detail/:id',
      name: 'Detail',
      component: () => import('../views/Detail.vue')
    },
    {
      path: '/addresslist',
      name: 'AddressList',
      component: () => import('../views/AddressList.vue')
    },
    {
      //:aid?其中?表示可有可无
      path: '/address/:aid?',
      name: 'Address',
      component: () => import('../views/Address.vue')
    },
    {
      path: '/pay',
      name: 'Pay',
      component: () => import('../views/Pay.vue')
    },
    {
      path: '/order',
      name: 'Order',
      component: () => import('../views/Order.vue')
    },
    {
      path: '/self',
      name: 'Self',
      component: () => import('../views/Self.vue')
    },
    {
      path: '/allike',
      name: 'Allike',
      component: () => import('../views/Allike.vue')
    },
  ]