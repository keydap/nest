<template>
<el-container>
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
  }
};
</script>
