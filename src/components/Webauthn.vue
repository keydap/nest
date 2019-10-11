<template>
  <el-container>
    <el-main>
      <el-form v-model.lazy="profile" :inline="true" label-width="120px" v-if="!noapps">
        <el-row justify="start" type="flex">
          <el-form-item v-for="(sk, index) in profile.securityKeys" :key="index">
            <div class="allowed-app">
              {{sk.name}}
            </div>
          </el-form-item>
        </el-row>
      </el-form>
      <span v-if="noapps">No Authorized Applications</span>
    </el-main>
  </el-container>
</template>

<script>
  /* eslint-disable */
  export default {
    name: "UserAllowedApps",
    data() {
      return {
      }
    }
  };
</script>
