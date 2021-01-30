import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import tumoBootRouter from './modules/tumo-boot'
import nestedRouter from './modules/nested'

/**
 * 注意：`sub-menu` 仅仅在route children.length >= 1 的时候才显示，否则仅作为一级路由展示
 */

/**
 * 路由常量对象
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'home', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        hidden: true
      },
      {
        path: 'setting',
        component: () => import('@/views/profile/components/setting'),
        hidden: true
      },
      {
        path: 'setting/base',
        component: () => import('@/views/profile/components/base-set'),
        hidden: true
      },
      {
        path: 'setting/safe',
        component: () => import('@/views/profile/components/safe-set'),
        hidden: true
      }
    ]
  }
]

/**
 * 异步加载路由，其定义在./modules文件夹中
 */
export const asyncRoutes = [

  // 自定义路由，[]集合
  // ...tumoBootRouter,

  nestedRouter,

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: 'Error Page',
      icon: 'bug'
    },
    children: [
      {
        path: '403',
        component: () => import('@/views/error/403'),
        name: '403',
        meta: { title: '403' }
      },
      {
        path: '404',
        component: () => import('@/views/error/404'),
        name: '404',
        meta: { title: '404' }
      },
      {
        path: '500',
        component: () => import('@/views/error/500'),
        name: '500',
        meta: { title: '500' }
      }
    ]
  },

  {
    path: '/external-link',
    children: [
      {
        path: 'https://github.com/Tumo-Team/Tumo-Boot',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/test',
        name: 'Test',
        component: () => import('@/views/modules/test/index'),
        meta: { title: 'Test', icon: 'radar-chart' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
