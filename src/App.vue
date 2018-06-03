<template>
  <div id="app">
    <el-container style="border: 1px solid #eee">
<el-header style="text-align: right; font-size: 12px">
  <el-menu class="el-menu-demo" mode="horizontal">
    <el-menu-item index="1" @click="openLink('/')">Users</el-menu-item>
    <el-menu-item index="2" @click="openLink('/groups')">Groups</el-menu-item>
    <el-menu-item index="3" @click="openLink('/apps')">Applications</el-menu-item>
    <el-menu-item index="4" @click="openLink('/settings')">System Settings</el-menu-item>
    <el-menu-item index="5" @click="openLink('/schemas')">Schema</el-menu-item>
    <el-menu-item index="6" @click="openLink('/sessions')">Active Sessions</el-menu-item>
  </el-menu>
  <!-- <span>Tom</span> -->
  </el-header>
</el-container>
<div>
    <router-view/>
</div>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    openLink (name) {
      this.$router.push(name)
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
  margin-top: 60px;
}
</style>
