/* eslint-disable */
import Vue from 'vue'
import ViewRouter from 'vue-router'
import UserList from '@/components/UserList'
import UserDetails from '@/components/UserDetails'
import Header from '@/components/Header'
import usersArray from '@/components/UserList'

Vue.use(ViewRouter)

function fetchUser (route) {
  // TODO I have no idea on how the below staement is
  // making it possible to access the usersArray present inside UserList
  var users = usersArray.data().resources
  console.log(users)
  var id = route.params.id
  console.log('route.id => ' + id)
  for(var i=0; i< users.length; i++) {
    if(users[i].id == id) {
      console.log('found user')
      return {user: users[i]}
    }
  }
  return {user: {}}
}

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
      //props: fetchUser
    }
  ]
})
