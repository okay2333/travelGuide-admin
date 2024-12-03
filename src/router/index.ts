import { createRouter, createWebHistory } from 'vue-router'
// https://github.com/luichooy/vue-antd-pro
// 常规路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    name: 'dashboard',
    meta: {
      isAuth: true
    },
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          icon: 'HomeOutlined',
          title: '首页'
        }
      }
    ]
  }, {
    path: '/user',
    component: () => import('@/layout/index.vue'),
    name: 'user',
    meta: {
      isAuto: true,
    },
    children: [
      {
        path: '',
        component: () => import('@/views/user/index.vue'),
        name: 'user',
        meta: {
          icon: 'UserOutlined',
          title: '用户管理'
        }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/user/detail.vue'),
        name: 'userDetail',
        hidden: true, // 表示隐藏在左侧菜单
        meta: {
          icon: 'UserOutlined',
          title: '用户详情'
        }
      }
    ]
  },
  {
    path: '/post',
    component: () => import('@/layout/index.vue'),
    name: 'post',
    meta: {
      isAuto: true,
    },
    children: [
      {
        path: '',
        component: () => import('@/views/post/index.vue'),
        name: 'post',
        meta: {
          icon: 'UserOutlined',
          title: '文章管理'
        }
      },
    ]
  },
  {
    path: '/scenic',
    component: () => import('@/layout/index.vue'),
    name: 'scenic',
    meta: {
      isAuto: true,
    },
    children: [
      {
        path: '',
        name: 'scenic',
        meta: {
          icon: 'UserOutlined',
          title: '景区管理'
        },
        children: [
          {
            path: 'ticket',
            component: () => import('@/views/scenic/ticket.vue'),
            meta: {
              icon: 'UserOutlined',
              title: '门票管理'
            },
          }, {
            path: 'reservation',
            component: () => import('@/views/scenic/reservation.vue'),
            meta: {
              icon: 'UserOutlined',
              title: '预约管理'
            },
          }
        ]
      },
    ]
  },
  {
    path: '/order',
    component: () => import('@/layout/index.vue'),
    name: 'order',
    meta: {
      isAuto: true,
    },
    children: [
      {
        path: '',
        component: () => import('@/views/order/index.vue'),
        name: 'order',
        meta: {
          icon: 'UserOutlined',
          title: '订单管理'
        }
      },
    ]
  }

]

const privateRoutes = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/user',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: 'user',
          icon: 'UserOutlined'
        }
      },
      {
        path: '/user/detail/:id',
        component: () => import('@/views/user/detail.vue'),
        meta: {
          title: 'detail',
        }
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/post',
        component: () => import('@/views/post/index.vue'),
        meta: {
          title: 'post',
          icon: 'UserOutlined'
        }
      }
    ]
  }, {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/order',
        component: () => import('@/views/order/index.vue'),
        meta: {
          title: 'order',
          icon: 'UserOutlined'
        }
      }
    ]
  }, 
{
  path: '/',
  component: () => import('@/layout/index.vue'),
  children: [
    {
      path: '/vrtour',
      component: () => import('@/views/vrtour/index.vue'),
      meta: {
        title: 'vrtour',
        icon: 'UserOutlined'
      }
    }
  ]
}
  ,{
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/test',
        component: () => import('@/views/test/index.vue'),
        meta: {
          title: 'test',
          icon: 'UserOutlined'
        }
      }
    ]
  }, {
    path: '/scenic',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: 'scenic',
      icon: 'UserOutlined'
    },
    children: [
      {
        path: '/scenic/ticket',
        component: () => import('@/views/scenic/ticket.vue'),
        meta: {
          title: 'ticket',
          icon: 'UserOutlined'
        }
      },
      {
        path: '/scenic/reservation',
        component: () => import('@/views/scenic/reservation.vue'),
        meta: {
          title: 'reservation',
          icon: 'UserOutlined'
        }
      },
      {
        path: '/scenic/reservation/add',
        component: () => import('@/views/scenic/reservation/add.vue'),
    
      },
      {
        path: '/scenic/scenic',
        component: () => import('@/views/scenic/scenic.vue'),
        meta: {
          title: 'scenic',
          icon: 'UserOutlined'
        }
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/article',
        component: () => import('@/views/article/index.vue'),
        name: 'article',
        meta: {
          icon: 'UserOutlined',
          title: 'article'
        }
      },
      {
        path: '/article/add',
        component: () => import('@/views/article/add.vue'),
      },
      {
        path: '/article/edit/:id',
        component: () => import('@/views/article/edit.vue'),
      },
    ]
  }
]


const publicRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/',
    // 注意：带有路径“/”的记录中的组件“默认”是一个不返回 Promise 的函数
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: 'dashboard',
          icon: 'role'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...publicRoutes, ...privateRoutes]
})



export default router
