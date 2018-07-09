<template>
  <div id="app">
    <div style="margin-left: 88%;">
      <div>
        <span>{{displayName}}</span>
      </div>
      <div>
        <a style="padding-left: 20px;" href="#" @click="showProfile">Profile</a><a style="padding-left: 10px;" href="#" @click="signout">Sign Out</a>
      </div>
    </div>
    <div>
    <el-container style="border: 1px solid #eee">
      <el-header style="text-align: right; font-size: 12px; padding: 0px;">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="1" @click="openLink('/')">Users</el-menu-item>
            <el-menu-item index="2" @click="openLink('/groups')">Groups</el-menu-item>
            <el-menu-item index="3" @click="openLink('/apps')">Applications</el-menu-item>
            <!-- <el-menu-item index="4" @click="openLink('/settings')">Domain Settings</el-menu-item> -->
            <!-- <el-menu-item index="5" @click="openLink('/schemas')">Schema</el-menu-item> -->
            <!-- <el-menu-item index="6" @click="openLink('/sessions')">Active Sessions</el-menu-item> -->
            <el-menu-item index="4" @click="openLink('/events')">Audit Events</el-menu-item>
          </el-menu>
        </el-header>
    </el-container>
    </div>
<div>
    <router-view/>
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
      if(this.profile == null) {
        return ''
      }
      let name = this.profile.displayname
      if(name == undefined || name == '') {
        name = this.profile.givenname + ' ' + this.profile.familyname
      }
      return name
    }
  },
  created() {
    if(this.profile == null) {
      this.fetchProfile()
    }
  },
  methods: {
    openLink (name) {
      this.$router.push(name)
    },
    fetchProfile() {
      axios.get(sp.SCIM_BASE_URL + 'Me').then(resp =>{
        sp.normalizeKeys(resp.data)
        console.log(resp.data)
        this.profile = resp.data
        sp.closeWait()
      }).catch(e =>{
        sp.showErr(e, '')
      })
    },
    showProfile () {
      console.log('show profile')
      this.$router.push({name: "UserProfile", params: this.profile})
    },
    signout () {
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
