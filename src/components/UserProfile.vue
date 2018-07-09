<template>
<el-container>
  <el-aside width="200px" style="background-color: #545c64">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1" @click="changePassword">Change Password</el-menu-item>
    </el-menu>
  </el-aside>
  <el-main>
  <el-form v-model.lazy="profile" :inline="true" label-width="120px">
      <el-row justify="start" type="flex">
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
      </el-row>
    </el-form>
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
      profile: {},
      activeIndex: "1"
    }
  },
  created() {
    this.profile = this.$route.params
  },
methods: {
  changePassword() {
  }
}    
};
</script>