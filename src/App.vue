<template>
  <div id="app">
    <div v-if="profile !== null">
      <div style="margin-left: 80%;">
        <div>
          <span>{{displayName}}&nbsp;({{domain}})</span>
        </div>
        <div>
          <!-- <router-link style="padding-left: 20px;" href="#" to="/profile"><el-tag>Profile</el-tag></router-link> -->
          <a style="padding-left: 20px;" href="#" @click="logout"><el-tag>Logout</el-tag></a>
        </div>
      </div>
      <div>
      <el-container style="border: 1px solid #eee">
        <el-header style="text-align: right; font-size: 12px; padding: 0px;">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
              <el-menu-item index="1" @click="openLink('/users')">Users</el-menu-item>
              <el-menu-item index="2" @click="openLink('/groups')">Groups</el-menu-item>
              <el-menu-item index="3" @click="openLink('/apps')">Applications</el-menu-item>
              <el-menu-item index="4" @click="openLink('/settings')">Settings</el-menu-item>
              <el-menu-item index="5" @click="openLink('/templates')">Templates</el-menu-item>
              <!-- <el-menu-item index="5" @click="openLink('/schemas')">Schema</el-menu-item> -->
              <!-- <el-menu-item index="6" @click="openLink('/sessions')">Active Sessions</el-menu-item> -->
              <el-menu-item index="6" @click="openLink('/events')">Audit Events</el-menu-item>
              <el-menu-item index="7" @click="openLink('/profile')">My Profile</el-menu-item>
            </el-menu>
          </el-header>
      </el-container>
      </div>
      <div>
          <router-view/>
      </div>
    </div>
    <div v-loading.fullscreen.lock="true" v-if="profile === null">
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as sp from './lib/sparrow'
import axios from "axios"

export default {
  name: 'App',
  data() {
    return {
      profile: null,
      activeIndex: "1"
    };
  },
  computed: {
    displayName() {
      let display = this.profile.displayname
      if(display == undefined || display == '') {
        let name = this.profile.name
        if(name !== undefined) {
          display = name.givenname + ' ' + name.familyname
        } else {
          display = ''
        }
      }
      return display
    },
    domain() {
      return this.profile.domain
    }
  },
  created() {
    this.fetchProfile()
    //this.openLink('/users')
  },
  methods: {
    openLink (name) {
      this.$router.push(name)
    },
    fetchProfile() {
      sp.showWait()
      axios.get(sp.SCIM_BASE_URL + 'Me').then(resp =>{
        sp.normalizeKeys(resp.data)
        this.profile = resp.data
        sp.setProfile(this.profile)
        sp.loadGroupNamesAndIds(true)
        sp.closeWait()
      }).catch(e =>{
        sp.closeWait()
        sp.showErr(e, 'Failed to load profile data')
      })
    },
    loadGroups() {
      // check for permissions before loading
    },
    logout () {
      axios.post(sp.SCIM_BASE_URL + 'logout').then(resp =>{
        this.reloadApp()
      }).catch(e =>{
        this.reloadApp()
      })
    },
    reloadApp() {
      this.profile = null
      let loc = window.location.toString()
      let pos = loc.indexOf('#')
      loc = loc.substring(0, pos)
      window.location.href = loc
    }
  }
}
</script>

<style>
body{
  /*overflow: hidden;*/
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
