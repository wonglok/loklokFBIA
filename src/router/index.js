import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/components/Pages/Login'
import Dashboard from '@/components/Pages/Dashboard'
import Article from '@/components/Pages/Article'

import { appState, waitLoginInfo } from '@/system/auth'

Vue.use(Router)

var b4enter = (from, to, next) => {
  console.log(appState)
  if (appState.isLoggedIn === true) {
    next()
  } else {
    waitLoginInfo().then(() => {
      next()
    }, () => {
      next({
        path: '/login'
      })
    })
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Hello
    },
    {
      path: '/articles/:id',
      component: Article
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/dashboard',
      component: Dashboard,
      beforeEnter: b4enter
    }
  ]
})
