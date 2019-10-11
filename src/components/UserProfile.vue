<template>
<el-container>
  <el-aside width="200px" style="background-color: #545c64">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1" @click="allowedApps">Allowed Applications</el-menu-item>
      <el-menu-item index="2" @click="setupSecurityKeys">Security Keys</el-menu-item>
      <el-menu-item index="3" @click="changePassword">Change Password</el-menu-item>
    </el-menu>
  </el-aside>
  <el-main>
  <el-form v-model.lazy="profile" :inline="true" label-width="120px" v-if="!noapps">
    <el-row justify="start" type="flex">
      <el-form-item v-for="(app, index) in profile.apps" :key="index">
        <a :href="app.url" target="_blank">
              <div class="allowed-app" v-if="app.icon == ''">
              {{app.name}}
              </div>
              <div v-else class="allowed-app" :style="{'background-image': 'url(' + app.icon + ')', 'background-repeat': 'no-repeat'}">
                <!-- <img height="140" width="100" :src="app.icon"> -->
                <div style="position: absolute; bottom: 3%; left: 20%">{{app.name}}</div>
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
  },
  noapps() {
    if(this.profile.apps == undefined) {
      return true
    }

    return this.profile.apps.length == 0
  }
},
methods: {
  changePassword() {
    let options = "menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes,width=420,height=230";
    let loc = window.location.toString()
    let pos = loc.indexOf('/ui#')
    loc = loc.substring(0, pos)
    loc = loc + '/changePassword?cl=1'
    let w = window.open(loc)
  },
  allowedApps() {
  },
  setupSecurityKeys() {
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
  width: 100px;
  height: 120px;
}
</style>
