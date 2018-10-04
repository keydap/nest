<template>
<el-container>
  <el-aside width="200px" style="background-color: #545c64">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1" @click="allowedApps">Allowed Applications</el-menu-item>
      <el-menu-item index="2" @click="changePassword">Change Password</el-menu-item>
    </el-menu>
  </el-aside>
  <el-main>
  <el-form v-model.lazy="profile" :inline="true" label-width="120px" v-if="!noapps">
    <el-row justify="start" type="flex">
      <el-form-item v-for="(value, key) in profile.apps" :key="key">
        <a :href="profile.apps[key]" target="_blank">
              <div class="allowed-app">
              {{key}}
              </div>
        </a>
      </el-form-item>
    </el-row>
    </el-form>
    <span v-if="noapps">No Authorized Applications</span>
    <!-- <el-row justify="start" type="flex">
      <el-form-item label="Username:">
        <span>{{profile.username}}</span>
      </el-form-item>
      <el-form-item label="First Name:">
        <span>{{profile.givenname}}</span>
      </el-form-item>
      <el-form-item label="Middle Name:">
        <span>{{profile.middlename}}</span>
      </el-form-item>
      <el-form-item label="Last Name:">
        <span>{{profile.lastname}}</span>
      </el-form-item>
    </el-row> -->
  </el-main>
  </el-container>
</template>

<script>
/* eslint-disable */
import * as sp from "../lib/sparrow"
import axios from "axios"

export default {
  name: "UserProfile",
  data() {
    return {
      activeIndex: "1"
    }
  },
computed: {
  profile() {
    return this.$store.state.profile
  }
},
methods: {
  noapps() {
    if(profile.apps == undefined) {
      return true
    }

    return (Object.keys(profile.apps).length == 0)
  },
  changePassword() {
    var options = "menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes,width=420,height=230";
    let w = window.open('http://localhost:7090/changePassword?cl=1')
    console.log(w)
  },
  allowedApps() {    
  }
}    
};
</script>
<style>
.allowed-app {
	background-color: rgba(103,194,58,.1);
	border-color: rgba(103,194,58,.2);
	color: #67c23a;
  white-space: nowrap;
  display: inline-block;
  font-size: 18px;
  padding: 20px;
}
</style>
