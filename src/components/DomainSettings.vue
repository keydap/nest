<template>
<el-container>
  <el-main>
  <el-form v-model.lazy="dconf" :inline="true" label-width="120px">
    <ResourceSettings :resources.sync="dconf.resources"/>
    <br/>
    <el-row justify="start" type="flex">
      <fieldset style="width: 80%;">
        <legend>RFC2307bis Support</legend>
        <el-row justify="start" type="flex">
        <el-form-item label="Enable:" label-width="158px">
          <el-checkbox v-model="dconf.rfc2307bis.enabled" size="small"></el-checkbox>
        </el-form-item>
        </el-row>
        <el-row justify="start" type="flex">
        <el-form-item label="Login Shell:" label-width="158px">
          <el-input v-model="dconf.rfc2307bis.loginShell" size="small"></el-input>
        </el-form-item>
        <el-form-item label="Home Directory Prefix:" label-width="170px">
          <el-input v-model="dconf.rfc2307bis.homeDirectoryPrefix" size="small"></el-input>
        </el-form-item>
        </el-row>
        <el-row justify="start" type="flex">
        <el-form-item label="Start uidNumber From:" label-width="158px">
          <el-input v-model.number="dconf.rfc2307bis.uidNumberStart" size="small"></el-input>
        </el-form-item>
        <el-form-item label="Start gidNumber From:" label-width="170px">
          <el-input v-model.number="dconf.rfc2307bis.gidNumberStart" size="small"></el-input>
        </el-form-item>
        </el-row>
      </fieldset>
    </el-row>
    <br/>
    <el-row justify="start" type="flex">
      <el-form-item label="OAuth Token TTL (seconds):" label-width="250px">
          <el-input v-model.number="dconf.oauth.tokenTtl" size="small"></el-input>
      </el-form-item>
      <el-form-item label="SSO Session Idle Time (seconds):" label-width="250px">
          <el-input v-model.number="dconf.oauth.ssoSessionIdleTime" size="small"></el-input>
      </el-form-item>
    </el-row>
    <el-row justify="start" type="flex">
      <el-form-item label="Token Validation Interval (seconds):" label-width="250px">
          <el-input v-model.number="dconf.oauth.tokenPurgeInterval" size="small"></el-input>
      </el-form-item>
      <el-form-item label="Password Hashing:" label-width="250px">
        <el-select v-model="dconf.ppolicy.passwordHashAlgo">
          <el-option
            v-for="value in supportedPasswdAlgos"
            :key="value.id"
            :label="value.display"
            :value="value.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-row>
    </el-form>
  </el-main>
  </el-container>
</template>

<script>
/* eslint-disable */
import ResourceSettings from './ResourceSettings'

export default {
  name: "DomainConf",
  data() {
    return {
      schemas: [],
      rtypes: [],
      supportedPasswdAlgos: [{id: "sha512", display: 'SHA512'}, {id: "ssha512", display: 'Salted SHA512'}, {id: "sha256", display: 'SHA256'}, {id: "ssha256", display: 'Salted SHA256'}, {id: "sha", display: 'SHA1'}, {id: "ssha", display: 'Salted SHA1'}, {id: "md5", display: 'MD5'}]
    }
  },
  beforeRouteLeave(to, from, next) {
    if(this.enableSave) {
      sp.confirm(next)
    }else {
      next(true)
    }
  },
methods: {
 },
computed: {
    dconf: {
      get() {
        return this.$store.state.domainconf
      },
      set(newVal) {
        return this.$store.commit({type: 'updateconf', dconf: newVal})
      }
    }
},
 components: {
   ResourceSettings
 }
};
</script>