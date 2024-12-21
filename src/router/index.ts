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
          icon: 'DashboardOutlined',
          title: '控制台'
        }
      }
    ]
  },
  // 1. 用户管理
  {
    path: '/user',
    component: () => import('@/layout/index.vue'),
    name: 'user',
    meta: {
      isAuto: true,
      sort: 1
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
        hidden: true,
        meta: {
          icon: 'UserOutlined',
          title: '用户详情'
        }
      }
    ]
  },
  // 2. 景区管理（包含子菜单）
  {
    path: '/scenic',
    component: () => import('@/layout/index.vue'),
    name: 'scenic',
    meta: {
      isAuto: true,
      sort: 2
    },
    children: [
      {
        path: '',
        name: 'scenic',
        meta: {
          icon: 'EnvironmentOutlined',
          title: '景区管理'
        },
        children: [
          {
            path: 'scenic',
            component: () => import('@/views/scenic/scenic.vue'),
            meta: {
              icon: 'PictureOutlined',
              title: '景点管理'
            }
          },
          {
            path: 'ticket',
            component: () => import('@/views/scenic/ticket.vue'),
            meta: {
              icon: 'TagsOutlined',
              title: '门票管理'
            },
          },
          {
            path: 'reservation',
            component: () => import('@/views/scenic/reservation.vue'),
            meta: {
              icon: 'ScheduleOutlined',
              title: '预约管理'
            },
          }
        ]
      },
    ]
  },
  // 3. 订单管理
  {
    path: '/order',
    component: () => import('@/layout/index.vue'),
    name: 'order',
    meta: {
      isAuto: true,
      sort: 3
    },
    children: [
      {
        path: '',
        component: () => import('@/views/order/index.vue'),
        name: 'order',
        meta: {
          icon: 'ShoppingCartOutlined',
          title: '订单管理'
        }
      },
    ]
  },
  // 4. 文章管理
  {
    path: '/post',
    component: () => import('@/layout/index.vue'),
    name: 'post',
    meta: {
      isAuto: true,
      sort: 4
    },
    children: [
      {
        path: '',
        component: () => import('@/views/post/index.vue'),
        name: 'post',
        meta: {
          icon: 'FileTextOutlined',
          title: '文章管理'
        }
      },
    ]
  },
  // 5. VR导览
  {
    path: '/vrtour',
    component: () => import('@/layout/index.vue'),
    name: 'vrtour',
    meta: {
      isAuto: true,
      sort: 5
    },
    children: [
      {
        path: '',
        component: () => import('@/views/vrtour/index.vue'),
        meta: {
          icon: 'EyeOutlined',
          title: 'VR导览'
        }
      }
    ]
  },
  {
    path: '/feedback',
    component: () => import('@/layout/index.vue'),
    name: 'feedback',
    meta: {
      isAuto: true,
    },
    children: [
      {
        path: '',
        component: () => import('@/views/feedback/index.vue'),
        name: 'FeedbackManagement',
        meta: {
          icon: 'MessageOutlined',
          title: '问题反馈'
        }
      }
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
          title: '用户管理',
          icon: 'UserOutlined'
        }
      },
      {
        path: '/user/detail/:id',
        component: () => import('@/views/user/detail.vue'),
        meta: {
          title: '用户详情',
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
          title: '文章管理',
          icon: 'FileTextOutlined'
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
          title: '订单管理',
          icon: 'ShoppingCartOutlined'
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
        title: 'VR导览',
        icon: 'EyeOutlined'
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
          title: '测试页面',
          icon: 'BugOutlined'
        }
      }
    ]
  }, {
    path: '/scenic',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '景区管理',
      icon: 'EnvironmentOutlined'
    },
    children: [
      {
        path: '/scenic/ticket',
        component: () => import('@/views/scenic/ticket.vue'),
        meta: {
          title: '门票管理',
          icon: 'TagsOutlined'
        }
      },
      {
        path: '/scenic/reservation',
        component: () => import('@/views/scenic/reservation.vue'),
        meta: {
          title: '预约管理',
          icon: 'ScheduleOutlined'
        }
      },
      {
        path: '/scenic/reservation/add',
        component: () => import('@/views/scenic/reservation/add.vue'),
        meta: {
          title: '添加预约'
        }
      },
      {
        path: '/scenic/scenic',
        component: () => import('@/views/scenic/scenic.vue'),
        meta: {
          title: '景点管理',
          icon: 'PictureOutlined'
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
          icon: 'FileTextOutlined',
          title: '文章管理'
        }
      },
      {
        path: '/article/add',
        component: () => import('@/views/article/add.vue'),
        meta: {
          title: '添加文章'
        }
      },
      {
        path: '/article/edit/:id',
        component: () => import('@/views/article/edit.vue'),
        meta: {
          title: '编辑文章'
        }
      },
    ]
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/feedback',
        component: () => import('@/views/feedback/index.vue'),
        meta: {
          title: '问题反馈',
          icon: 'MessageOutlined'
        }
      }
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
          title: '控制台',
          icon: 'DashboardOutlined'
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

