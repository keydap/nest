/* eslint-disable */
import Vue from 'vue'
import ViewRouter from 'vue-router'
import UserList from '@/components/UserList'
import UserDetails from '@/components/UserDetails'
import Header from '@/components/Header'
import usersArray from '@/components/UserList'
import GroupList from '@/components/GroupList'
import GroupDetails from '@/components/GroupDetails'

Vue.use(ViewRouter)

export default new ViewRouter({
  routes: [
    {
      path: '/',
      name: 'UserList',
      component: UserList
    },
    {
      path: '/header',
      name: 'Header',
      component: Header
    },
    {
      path: '/users/:id',
      name: 'UserDetails',
      component: UserDetails
    },
    {
      path: '/groups',
      name: 'GroupList',
      component: GroupList
    },
    {
      path: '/groups/:id',
      name: 'GroupDetails',
      component: GroupDetails
    }
  ]
})
