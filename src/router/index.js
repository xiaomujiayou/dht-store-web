import { createRouter, createWebHistory } from 'vue-router'
import SystemView from '@/views/system.vue'
import SearchView from '@/views/search.vue'
import DownloaderView from '@/views/downloader.vue'
import SettingView from '@/views/setting.vue'
import AddDownloader from '@/views/add-downloader.vue'
import EditPassword from '@/views/edit-password.vue'
import DataShow from '@/views/data-show.vue'
import LoginView from '@/views/login.vue'

const router = createRouter({
  history: createWebHistory(),  // history 模式
  routes: [
    {
      path: '/',
      redirect: '/system',
    }, {
      path: '/system',
      component: SystemView,
      meta: {
        title: '系统状态',
      },
    }, {
      path: '/search',
      component: SearchView,
      meta: {
        title: '资源搜索',
      },
    }, {
      path: '/downloader',
      component: DownloaderView,
      meta: {
        title: '下载器',
      },
    }, {
      path: '/setting',
      component: SettingView,
      meta: {
        title: '设置',
      },
    }, {
      path: '/login',
      component: LoginView,
      meta: {
        title: '登录',
      },
    }, {
      path: '/setting/add-downloader',
      component: AddDownloader,
      meta: {
        title: '添加下载器',
      },
    }, {
      path: '/setting/edit-password',
      component: EditPassword,
      meta: {
        title: '修改密码',
      },
    }, {
      path: '/setting/data-show',
      component: DataShow,
      meta: {
        title: '系统数据展示',
      },
    }
  ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // console.log(to, from)
  if (to.meta.title) {
    document.title = `${to.meta.title}`
  }
  next()
})

export default router
