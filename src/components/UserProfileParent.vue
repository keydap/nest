<template>
<el-container>
  <el-aside width="200px" style="background-color: #545c64">
    <el-menu class="el-menu-demo" mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1" @click="showAllowedApps">Allowed Applications</el-menu-item>
      <el-menu-item index="2" @click="showSecurityKeys">Security Keys</el-menu-item>
      <el-menu-item index="3" @click="changePassword">Change Password</el-menu-item>
    </el-menu>
  </el-aside>
  <router-view class="child"></router-view>
</el-container>
</template>
<script>
/* eslint-disable */
import * as sp from "../lib/sparrow"
/* use generic JSON patch generating library instead of scim-rfc6902 to have array index in generated patchset */
import * as jsonpatch from "rfc6902"
import axios from "axios"

export default {
  name: 'UserProfileParent',
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    showAllowedApps() {
      this.$router.push({name: "UserAllowedApps"});
    },
    changePassword() {
      let options = "menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes,width=420,height=230";
      let loc = window.location.toString()
      let pos = loc.indexOf('/ui#')
      loc = loc.substring(0, pos)
      loc = loc + '/changePassword?cl=1'
      let w = window.open(loc)
    },
    showSecurityKeys() {
      this.$router.push({name: "SecurityKeys"});
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
