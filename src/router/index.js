import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/modules/user.js'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  },

  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/good',
    name: 'sysManage',
    meta: { title: '员工功能', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'classification',
        name: 'classification',
        component: () => import('@/views/sys/classification'),
        meta: { title: '分类管理', icon: 'el-icon-s-operation' }
      },
      {
        path: 'good',
        name: 'good',
        component: () => import('@/views/sys/good'),
        meta: { title: '库存管理', icon: 'table' }
      },
      {
        path: 'goodrecord',
        name: 'goodrecord',
        component: () => import('@/views/sys/goodrecord'),
        meta: { title: '出入库记录', icon: 'form' }
      },

      {
        path: 'personal',
        name: 'personal',
        component: () => import('@/views/sys/personal'),
        meta: { title: '个人中心', icon: 'el-icon-user-solid' }
      }
    ]
  }

]

// 动态路由
export const asyncRoutes = [

  {
    path: '/boss',
    component: Layout,
    redirect: '/boss/provider',
    name: 'test',
    meta: { title: '老板功能', icon: 'el-icon-s-tools', roles: ['admin'] },
    children: [
      {
        path: 'provider',
        name: 'provider',
        component: () => import('@/views/boss/provider'),
        meta: { title: '供应商管理', icon: 'el-icon-s-shop', roles: ['admin'] }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/boss/user'),
        meta: { title: '用户管理', icon: 'tree', roles: ['admin'] }
      },
      {
        path: 'attendrecord',
        name: 'attendrecord',
        component: () => import('@/views/boss/attendrecord'),
        meta: { title: '考勤记录', icon: 'form', roles: ['admin'] }
      }

    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
