<template>
<el-container>
  <el-aside width="200px" style="background-color: #545c64">
    <el-menu class="el-menu-demo" mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1" @click="save" v-if="enableSave">Save</el-menu-item>
      <el-menu-item index="3" @click="backToAppList">&lt;-Back to List</el-menu-item>
    </el-menu>
  </el-aside>
  <el-main>
    <el-tabs v-model="currentTopTab" type="border-card" @tab-click="tabSelected">
      <el-tab-pane label="Core" name="Core">
        <el-form v-model.lazy="app" :inline="true" label-width="120px">
          <el-row justify="start" type="flex">
            <el-form-item label="Name:">
              <el-input label="Name" placeholder="sampleapp" v-model="app.name" size="small"></el-input>
            </el-form-item>
            <el-form-item label="Description:">
              <el-input placeholder="Sample app description" v-model="app.description" size="small"></el-input>
            </el-form-item>
            <el-form-item label="Active:">
              <el-checkbox v-model="app.active" size="small"></el-checkbox>
            </el-form-item>
          </el-row>
          <el-row justify="start" type="flex">
            <label class="el-form-item__label" style="width: 120px;">Home URL:</label>
            <el-input placeholder="https://myapp.com/login" v-model="app.homeurl" size="small" style="width: 450px"></el-input>
            <label class="el-form-item__label" style="width: 120px;">Icon:</label>
            <img ref="appIcon" height="140" width="100" :src="app.icon" @click="selectIcon"/>
            <input type="file" ref="iconFile" @change="changeIcon" style="opacity: 0; width: 0px; height: 0px">
          </el-row>
          <el-row justify="start" type="flex">
              <AppGroupsSa :resource="app"/>
          </el-row>
          <el-tabs v-model="currentTab" type="border-card" style="height: 100%; width: 100%">
            <el-tab-pane label="SAML" name="SAML">
              <el-row justify="start" type="flex">
                <el-col :span="50">
                  <label class="el-form-item__label" style="width: 225px;">Single Logout Service URL:</label>
                </el-col>
                <el-input placeholder="https://myapp.com/saml/logout" v-model="app.slourl" size="small" style="width: 450px"></el-input>
              </el-row>
              <el-row justify="start" type="flex">
                <el-col :span="50">
                  <label class="el-form-item__label" style="width: 225px;">Metadata URL:</label>
                </el-col>
                  <el-input placeholder="https://myapp.com/saml/metadata" v-model="app.metaurl" size="small" style="width: 450px"></el-input>
              </el-row>
              <el-row justify="start" type="flex">
                <el-col :span="50">
                  <label class="el-form-item__label" style="width: 225px;">SP Issuer:</label>
                </el-col>
                  <el-input placeholder="https://myapp.com" v-model="app.spissuer" size="small" style="width: 450px"></el-input>
              </el-row>
              <el-row justify="start" type="flex">
                <el-col :span="50">
                  <label class="el-form-item__label" style="width: 225px;">IDP Issuer:</label>
                </el-col>
                  <el-input v-model="domain" :disabled="true" size="small" style="width: 450px"></el-input>
              </el-row>
              <el-row justify="start" type="flex">
                <el-form-item label="Assertion Validity:" label-width="225px">
                  <el-input placeholder="1200" v-model.number="app.assertionvalidity" size="small" style="width: 120px"></el-input>
                </el-form-item>
              </el-row>
              <MultiValCa displayHeader="Attributes" :metadata="metadata['samlattributes']" :resource="app" complexAt="samlattributes"></MultiValCa>
            </el-tab-pane>
            <el-tab-pane label="OAuth" name="OAuth">
              <el-row justify="start" type="flex">
                <el-form-item label="Redirect URI:">
                  <el-input placeholder="https://myapp.com/connect" v-model="app.redirecturi" size="small"></el-input>
                </el-form-item>
                <el-form-item label="Require Consent:" label-width="140px">
                  <el-checkbox v-model="app.consentrequired" size="small"></el-checkbox>
                </el-form-item>
              </el-row>
              <el-row justify="start" type="flex">
                <el-form-item label="Secret:">
                  <el-input placeholder="" v-model="app.secret" size="small"></el-input>
                </el-form-item>
              </el-row>
              <MultiValCa displayHeader="Attributes" :metadata="metadata['oauthattributes']" :resource="app" complexAt="oauthattributes"></MultiValCa>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="JSON View" name="JSON View">
        <el-input v-model="appJsonText" type="textarea" rows="25" size="medium"></el-input>
      </el-tab-pane>
    </el-tabs>
  </el-main>
  </el-container>
</template>

<script>
/* eslint-disable */
import MultiValCa from './MultiValCa.vue'
import AppGroupsSa from './AppGroupsSa.vue'
import * as sp from '../lib/sparrow'
import axios from "axios"
import * as jp from "scim-rfc6902"
import { MessageBox } from 'element-ui';

export default {
  name: "AppDetails",
  data() {
    return {
    metadata: {
      samlattributes: [
            {name: 'value', decorated: 'Name', type: 'string'},
            {name: 'format', decorated: 'Format', type: 'string'},
            {name: 'scimexpr', decorated: 'Filter', type: 'string'},
            {name: 'staticval', decorated: 'Static Value', type: 'string'},
            {name: 'staticmultivaldelim', decorated: 'Static Value Delimiter', type: 'string'}
        ],
      oauthattributes: [
            {name: 'value', decorated: 'Name', type: 'string'},
            {name: 'scimexpr', decorated: 'Filter', type: 'string'},
            {name: 'staticval', decorated: 'Static Value', type: 'string'},
            {name: 'staticmultivaldelim', decorated: 'Static Value Delimiter', type: 'string'}
        ]
    },
    // this is the default app's configuration for better UX
    app: {"groupids":[], "active":true,"assertionvalidity":60,"consentrequired":true,"description":"ExampleApp","homeurl":"https://example.com","metaurl":"https://example.com/saml/meta","name":"example","oauthattributes":[{"value":"sub","scimexpr":"username"}],"redirecturi":"https://example.com/oauth2/code","samlattributes":[{"format":"urn:oasis:names:tc:SAML:2.0:nameid-format:persistent","value":"uid","scimexpr":"username"},{"format":"urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress","value":"mail","scimexpr":"emails.value"},{"value":"lastName","scimexpr":"name.lastName"},{"value":"firstName","scimexpr":"name.firstName"}],"schemas":["urn:keydap:params:scim:schemas:core:2.0:Application"]},
    originalApp: {},
    enableSave: false,
    currentTab: 'SAML',
    currentTopTab: 'Core',
    appJsonText: ''
    };
  },
  computed: {
      domain: {
        get() {
          return this.$store.state.profile.domain
        },
        set(newVal) {
          // do nothing because domain value will always be reset on the server
        }
      }
  },
  watch: {
    app: {
      deep: true,
      handler: function(newVal, oldVal) {
        if(this.app._justLoaded) {
          delete this.app._justLoaded
        }
        else {
          this.enableSave = true
        }
      }
    }
  },
  created() {
    this.showApp()
  },
  beforeRouteLeave(to, from, next) {
    if(this.enableSave) {
      sp.confirm(next)
    }else {
      next(true)
    }
  },
  methods: {
    save() {
      // call update if the app already exists
      if(this.app.id != null) {
        this.update()
        return
      }

      axios.post('/v2/Applications', this.app, sp.AXIOS_SCIM_CREATE_CONFIG).then(resp => {
        sp.normalizeKeys(resp.data)
        this.app = resp.data
        // deep clone the object
        this.originalApp = JSON.parse(JSON.stringify(resp.data))
        this.enableSave = false
        this.app._justLoaded = true
      }).catch(e => {
        sp.showErr(e, 'Failed to create user')
      })
    },
    update() {
      var ops = jp.createScimPatch(this.originalApp, this.app, sp.getResType('application'))
      this.pathchApp(ops)
    },
    pathchApp(ops) {
      if(ops.length == 0) {
        this.enableSave = false
        return
      }

      var patch = {'schemas':['urn:ietf:params:scim:api:messages:2.0:PatchOp'], 'Operations': ops}
      sp.showWait()
      var axiosConf = {headers: {'Content-Type': sp.SCIM_JSON_TYPE, 'If-Match': this.app.meta.version}}
      var url = sp.APPS_URL+this.app.id+'?attributes=*'
      axios.patch(url, patch, axiosConf).then(resp => {
          sp.normalizeKeys(resp.data)
          this.app = resp.data
          // deep clone the object
          this.originalApp = JSON.parse(JSON.stringify(resp.data))
          this.enableSave = false

          // initialize the groupids array
          if(this.app.groupids == undefined) {
            this.$set(this.app, "groupids", [])
          }

          this.app._justLoaded = true
          sp.closeWait()
      }).catch(e => {
        sp.showErr(e, '')
      })
    },
    backToAppList() {
      this.$router.push({path: '/apps'})
    },
    showApp() {
      var id = this.$route.params.id
      if(id != 'new') {
        sp.showWait()
        axios.get(sp.APPS_URL+id).then(resp =>{
          sp.normalizeKeys(resp.data)
          this.app = resp.data
          // deep clone the object
          this.originalApp = JSON.parse(JSON.stringify(resp.data))

          // initialize the groupids array
          if(this.app.groupids == undefined) {
            this.$set(this.app, "groupids", [])
          }

          this.app._justLoaded = true
          sp.closeWait()
        }).catch(e =>{
          sp.showErr(e, '')
        })
      }
    },
    tabSelected() {
      if(this.currentTopTab == 'JSON View') {
        this.appJsonText = JSON.stringify(this.app, null, 2)
      }
    },
    changeIcon() {
      let f = this.$refs.iconFile.files[0]
      if(!f.type.startsWith('image/')) {
        sp.showErr(null, 'Invalid image')
        return
      }
      if(f.size > 1048576) { // 1 MB
         sp.showErr(null, 'Icon size cannot exceed 1MB, please select an image with smaller size')
         return
      }
      let fileReader = new FileReader()
      let imgRef = this.$refs.appIcon
      let self = this
      fileReader.addEventListener('load', function(){
        imgRef.src = fileReader.result
        self.$set(self.app, 'icon', fileReader.result)
      }, false)
      fileReader.readAsDataURL(f)
    },
    selectIcon() {
      this.$refs.iconFile.click()
    }
  },
  components: {
    MultiValCa,
    AppGroupsSa
  }
};
</script>
