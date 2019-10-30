<template>
<el-container>
  <el-aside width="200px" style="background-color: #545c64">
    <el-menu class="el-menu-demo" mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1" @click="save" v-if="enableSave">Save</el-menu-item>
      <el-menu-item index="2" @click="showDomainSettings">Config</el-menu-item>
      <el-menu-item index="3" @click="showReplicationSettings">Replication</el-menu-item>
      <el-menu-item index="4" @click="dialogVisible = true">Add New Domain</el-menu-item>
    </el-menu>
  </el-aside>
  <router-view class="child"></router-view>

  <!-- dialog for adding a replication peer -->
  <el-dialog title="New Domain" :visible.sync="dialogVisible" width="30%" center modal>
    <el-form>
      <el-form-item label="Name:" label-width="100px">
        <el-input v-model="domainName" placeholder="domain.com" tabindex="1"></el-input>
      </el-form-item>
      <el-row justify="center" type="flex">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="createNewDomain">Ok</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</el-container>
</template>
<script>
/* eslint-disable */
import * as sp from "../lib/sparrow"
/* use generic JSON patch generating library instead of scim-rfc6902 to have array index in generated patchset */
import * as jsonpatch from "rfc6902"
import axios from "axios"

export default {
  name: 'SettingsParent',
  data() {
    return {
      origDconf: {},
      enableSave: false,
      dialogVisible: false,
      domainName: ''
    }
  },
created() {
    this.fetchDomainConf()
},
  watch: {
    dconf: {
      deep: true,
      handler: function(newVal, oldVal) {
        if(this.origDconf._justLoaded) {
          delete this.origDconf._justLoaded
        }
        else {
          this.enableSave = true
        }
      }
    }
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
methods: {
  fetchDomainConf() {
    axios.get(sp.DOMAIN_CONF_URL).then(resp =>{
      // domain configuration is case-sensitive
      this.origDconf = JSON.parse(JSON.stringify(resp.data))
      this.origDconf._justLoaded = true
      var conf = resp.data
      this.$store.commit('updateconf', {dconf: conf})
      sp.closeWait()
    }).catch(e =>{
      sp.showErr(e, 'Failed to load domain configuration')
    })
  },
  save() {
    delete this.origDconf._justLoaded
    // merge the LDAP template changes first before generating a patch
    this.$store.commit('mergeLdapTemplates', {})
    let ops = jsonpatch.createPatch(this.origDconf, this.dconf)
    if(ops.length == 0) {
      return
    }

    var axiosConf = {headers: {'If-Match': this.dconf.scim.meta.version}}
    axios.patch(sp.DOMAIN_CONF_URL, ops, axiosConf).then(resp =>{
      // domain configuration is case-sensitive
      var conf = resp.data
      this.enableSave = false
      this.origDconf = JSON.parse(JSON.stringify(conf))
      this.origDconf._justLoaded = true
      this.$store.commit({type: 'updateconf', dconf: conf})
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
  },
  showDomainSettings() {
    this.$router.push({name: "DomainSettings"});
  },
  showReplicationSettings() {
    this.$router.push({name: "ReplicationSettings"});
  },
  createNewDomain() {
    sp.showWait()
    var req = {
      url: sp.DOMAINS_LC_URL,
      method: 'post',
      data: 'op=create&name=' + this.domainName,
      config: {headers: sp.AXIOS_FORM_URL_ENCODE_CONFIG}
    }
    axios.request(req).then(resp =>{
      this.dialogVisible = false
      this.domainName = ''
      sp.closeWait()
    }).catch(e => {
      sp.closeWait()
      sp.showErr(e, 'Failed to create new domain')
    })
  }
}
};
</script>
