/* eslint-disable */
import Vue from 'vue'
import ViewRouter from 'vue-router'
import UserList from '@/components/UserList'
import UserDetails from '@/components/UserDetails'
import Header from '@/components/Header'
import GroupList from '@/components/GroupList'
import GroupDetails from '@/components/GroupDetails'
import AppList from '@/components/AppList'
import AppDetails from '@/components/AppDetails'
import AuditEventList from '@/components/AuditEventList'
import AuditEventDetails from '@/components/AuditEventDetails'
import UserProfile from '@/components/UserProfile'
import DomainSettings from '@/components/DomainSettings'
import SettingsParent from '@/components/SettingsParent'
import Templates from '@/components/Templates'

Vue.use(ViewRouter)

export default new ViewRouter({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: UserList
    },
    {
      path: '/users',
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
    },
    {
      path: '/apps',
      name: 'AppList',
      component: AppList
    },
    {
      path: '/apps/:id',
      name: 'AppDetails',
      component: AppDetails
    },
    {
      path: '/events',
      name: 'AuditEventList',
      component: AuditEventList
    },
    {
      path: '/events/:id',
      name: 'AuditEventDetails',
      component: AuditEventDetails
    },
    {
      path: '/profile',
      name: 'UserProfile',
      component: UserProfile
    },
    {
      path: '/settings',
      component: SettingsParent,
      children: [
        {
          path: '',
          name: 'DomainSettings',
          component: DomainSettings
        }
      ]
    },
    {
      path: '/templates',
      name: 'Templates',
      component: Templates
    }
  ]
})
