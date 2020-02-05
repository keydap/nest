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
        <el-col :span="2" style="text-align: left; font-size: 12px; padding: 0px;">
            <el-menu router :default-active="activeIndex" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
              <el-menu-item index="/users" >Users</el-menu-item>
              <el-menu-item index="/groups">Groups</el-menu-item>
              <el-menu-item index="/apps">Applications</el-menu-item>
              <el-menu-item index="/settings">Settings</el-menu-item>
              <el-menu-item index="/templates">Templates</el-menu-item>
              <!-- <el-menu-item index="5" @click="openLink('/schemas')">Schema</el-menu-item> -->
              <!-- <el-menu-item index="6" @click="openLink('/sessions')">Active Sessions</el-menu-item> -->
              <el-menu-item index="/events">Audit Events</el-menu-item>
              <el-menu-item index="/profile">My Profile</el-menu-item>
            </el-menu>
          </el-col>
        <el-col>
          <div>
            <router-view/>
          </div>
        </el-col>
      </el-container>
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
  beforeCreate() {
      sp.showWait()
      axios.get(sp.SCIM_BASE_URL + 'Me').then(resp =>{
        sp.normalizeKeys(resp.data)
        this.$store.commit('updateprofile', {profile: resp.data})
        sp.loadGroupNamesAndIds(true)
        sp.closeWait()
      }).catch(e =>{
        sp.closeWait()
        sp.showErr(e, 'Failed to load profile data')
      })
  },
  data() {
    return {
      activeIndex: "/users"
    };
  },
  computed: {
    profile() {
      return this.$store.state.profile
    },
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
    let path = this.$router.history.current.path
    if(path != '/') {
      this.activeIndex = path
    }
  },
  methods: {
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
      this.$store.commit('updateprofile', {profile: {}})
      window.location.href = "/ui"
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
