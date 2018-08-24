<template>
<el-container>
  <el-aside width="200px" style="background-color: #545c64">
    <el-menu class="el-menu-demo" mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1" @click="save" v-if="enableSave">Save</el-menu-item>
    </el-menu>
  </el-aside>
  <el-main>
  <el-form v-model.lazy="dconf" :inline="true" label-width="250px">
    <el-row justify="start" type="flex">
      <el-form-item label="OAuth Token TTL (seconds):">
          <el-input v-model.number="dconf.oauth.tokenTtl" size="small"></el-input>
      </el-form-item>
    </el-row>
    <el-row justify="start" type="flex">
      <el-form-item label="SSO Session Idle Time (seconds):">
          <el-input v-model.number="dconf.oauth.ssoSessionIdleTime" size="small"></el-input>
      </el-form-item>
    </el-row>
    <el-row justify="start" type="flex">
      <el-form-item label="Token Validation Interval (seconds):">
          <el-input v-model.number="dconf.oauth.tokenPurgeInterval" size="small"></el-input>
      </el-form-item>
    </el-row>
    <el-row justify="start" type="flex">
      <el-form-item label="Password Hashing:">
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
import * as sp from "../lib/sparrow"
import * as jp from "scim-rfc6902"
import axios from "axios"
const url = sp.SCIM_BASE_URL + 'DomainConfig'

export default {
  name: "DomainConf",
  data() {
    return {
      dconf: {oauth: {}, ppolicy: {}},
      origDconf: {},
      schemas: [],
      rtypes: [],
      supportedPasswdAlgos: [{id: "sha512", display: 'SHA512'}, {id: "ssha512", display: 'Salted SHA512'}, {id: "sha256", display: 'SHA256'}, {id: "ssha256", display: 'Salted SHA256'}, {id: "sha", display: 'SHA1'}, {id: "ssha", display: 'Salted SHA1'}, {id: "md5", display: 'MD5'}],
      enableSave: false
    }
  },
  watch: {
    dconf: {
      deep: true,
      handler: function(newVal, oldVal) {
        if(this.dconf._justLoaded) {
          delete this.dconf._justLoaded
        }
        else {
          this.enableSave = true
        }
      }
    }
  },
  created() {
    this.fetchDomainConf()
  },
  beforeRouteLeave(to, from, next) {
    if(this.enableSave) {
      sp.confirm(next)
    }else {
      next(true)
    }
  },
methods: {
  fetchDomainConf() {
    axios.get(url).then(resp =>{
      // domain configuration is case-sensitive
      this.dconf = resp.data
      this.dconf._justLoaded = true
      this.origDconf = JSON.parse(JSON.stringify(this.dconf))
      sp.closeWait()
    }).catch(e =>{
      sp.showErr(e, 'Failed to load domain configuration')
    })
  },
  save() {
    let ops = jp.createPatch(this.origDconf, this.dconf)
    if(ops.length == 0) {
      return
    }

    axios.patch(url, ops).then(resp =>{
      // domain configuration is case-sensitive
      this.dconf = resp.data
      this.enableSave = false
      this.dconf._justLoaded = true
      this.origDconf = JSON.parse(JSON.stringify(this.dconf))
      sp.closeWait()
    }).catch(e =>{
      if(e.response.status == 304) {
        this.enableSave = false
        sp.showErr(e, 'Domain configuration was not changed')
      }
      else {
        sp.showErr(e, 'Failed to update domain configuration')
      }
    })
  }
 }
};
</script>