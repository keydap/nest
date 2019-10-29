<template>
<el-container>
  <el-aside width="200px" style="background-color: #545c64">
    <el-menu class="el-menu-demo" mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1" @click="save" v-if="enableSave && currentTab == 'Core'">Save</el-menu-item>
      <el-menu-item index="2" @click="saveJson" v-if="enableJsonSave">Save JSON</el-menu-item>
      <el-menu-item index="3" @click="resetPassword" v-if="user.meta != null">Reset Password</el-menu-item>
      <el-menu-item index="4" @click="backToUserList">&lt;-Back to List</el-menu-item>
    </el-menu>
  </el-aside>
  <el-main>
    <el-tabs type="border-card" v-model="currentTab" @tab-click="showJson" :before-leave="validateJson">
      <el-tab-pane name="Core" label="Core">
        <el-form v-model.lazy="user" :inline="true" label-width="120px">
          <el-row justify="start" type="flex">
            <el-form-item label="Username:">
              <el-input label="Username" placeholder="Username" v-model="user.username" size="small"></el-input>
            </el-form-item>
            <el-form-item label="Password:" v-if="user.id == null">
              <el-input type="password" v-model="user.password" size="small"></el-input>
            </el-form-item>
            <el-form-item label="Dsiplay Name:" v-else>
              <el-input placeholder="Dsiplay Name" v-model="user.displayname" size="small"></el-input>
            </el-form-item>
            <el-form-item label="Active:">
              <el-checkbox v-model="user.active" size="small"></el-checkbox>
            </el-form-item>
          </el-row>
        <el-row justify="start" type="flex">
        <!-- <el-form-item label="Prefix:">
          <el-input placeholder="Prefix" v-model="user.name.honorificprefix" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="Suffix:">
          <el-input placeholder="Suffix" v-model="user.name.honorificsuffix" size="mini"></el-input>
        </el-form-item> -->
          <el-form-item label="First Name:">
            <el-input label="givenname" placeholder="First Name" v-model="user.name.givenname" size="small"></el-input>
          </el-form-item>
          <el-form-item label="Middle Name:">
            <el-input label="middlename" placeholder="Middle Name" v-model="user.name.middlename" size="small"></el-input>
          </el-form-item>
          <el-form-item label="Last Name:">
            <el-input label="familyname" placeholder="Last Name" v-model="user.name.familyname" size="small"></el-input>
          </el-form-item>
          <!-- <el-form-item label="Formatted Name:">
            <el-input label="formatted" placeholder="Formatted Name" v-model="user.name.formatted" size="small"></el-input>
          </el-form-item> -->
        </el-row>
        <!-- <div align="left">
        <el-form-item label="Nickname:">
          <el-input placeholder="Nickname" v-model="user.nickname" size="small"></el-input>
        </el-form-item>
        </div> -->
        <el-row justify="start" type="flex">
        <el-form-item size="medium" label="User Type:">
          <el-input placeholder="e.g Contractor" v-model="user.usertype" size="small"></el-input>
        </el-form-item>
        <!-- <el-form-item label="Preferred Language:" label-width="145px">
          <el-input placeholder="e.g English" v-model="user.preferredlanguage" size="small"></el-input>
        </el-form-item> -->
        <el-form-item label="Locale:">
          <el-input placeholder="e.g India" v-model="user.locale" size="small"></el-input>
        </el-form-item>
        <el-form-item label="Timezone:">
          <el-input placeholder="e.g IST" v-model="user.timezone" size="small"></el-input>
        </el-form-item>
        </el-row>
        <el-row justify="start" type="flex">
          <el-form-item label="Set Twofactor Auth Type:" label-width="172px">
          <el-select v-model="twofactortype" placeholder="Select">
            <el-option
              v-for="(value, index) in supportedTfaTypes"
              :key="index"
              :label="value.display"
              :value="value.id">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="Force Password Change At Next Login:" label-width="301px">
            <el-checkbox v-model="forcechangepassword" size="small"></el-checkbox>
          </el-form-item>
        </el-row>
        <!-- <MultiValCa displayHeader="Groups" :metadata="metadata['groups']" :resource="user" complexAt="groups"></MultiValCa> -->
        <UserGroupsCa :metadata="metadata['groups']" :resource="user" complexAt="groups"></UserGroupsCa>
        <MultiValCa displayHeader="Emails" :metadata="metadata['emails']" :resource="user" complexAt="emails"></MultiValCa>
        <MultiValCa displayHeader="Addresses" :metadata="metadata['addresses']" :resource="user" complexAt="addresses"></MultiValCa>
        <MultiValCa displayHeader="Phone Numbers" :metadata="metadata['phonennumbers']" :resource="user" complexAt="phonennumbers"></MultiValCa>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="JSON View" name="JSON View">
        <el-input v-model="userJsonText" type="textarea" rows="25" size="medium"></el-input>
      </el-tab-pane>
    </el-tabs>
  </el-main>
  </el-container>
</template>

<script>
/* eslint-disable */
import MultiValCa from './MultiValCa.vue'
import UserGroupsCa from './UserGroupsCa.vue'
import * as sp from '../lib/sparrow'
import axios from "axios"
import { USERS_URL } from '../lib/sparrow';
import * as jp from "scim-rfc6902"
import { MessageBox } from 'element-ui';

const commonComplexAtMetadata = [
            {name: 'value', decorated: 'Value', type: 'string'},
            {name: 'display', decorated: 'Display', type: 'string'},
            {name: 'type', decorated: 'Type', type: 'string'},
            {name: 'primary', decorated: 'Primary', type: 'boolean'}
        ]
const authSchemaExtUri = 'urn:keydap:params:scim:schemas:extension:authentication:2.0:User'

export default {
  name: "UserDetails",
  data() {
    return {
    metadata: {
      emails: commonComplexAtMetadata,
      phonennumbers: commonComplexAtMetadata,
      ims: commonComplexAtMetadata,
      groups: [{name: 'display', decorated: 'Name', type: 'string'}, {name: 'value', decorated: 'ID', type: 'string'}],
      addresses: [
            {name: 'streetaddress', decorated: 'Street', type: 'string'},
            {name: 'locality', decorated: 'Locality', type: 'string'},
            {name: 'region', decorated: 'Region', type: 'string'},
            {name: 'postalcode', decorated: 'Postal Code', type: 'string'},
            {name: 'country', decorated: 'Country', type: 'string'},
            {name: 'type', decorated: 'Type', type: 'string'},
        ]
    },
    user: {schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'], name: {}},
    originalUser: {},
    enableSave: false,
    enableJsonSave: false,
    currentTab: 'Core',
    userJsonText: '',
    supportedTfaTypes: [{id: '', display: 'None'}, {id: 'totp', display: 'TOTP'}, {id: 'webauthn', display: 'WebAuthn'}]
    };
  },
  computed: {
    twofactortype: {
      get: function() {
            var ext = this.user[authSchemaExtUri]
            if (ext === undefined || ext === null) {
              ext = {twofactortype: ''}
              this.$set(this.user, authSchemaExtUri, ext)
              this.user._justLoaded = true
            }
            return ext.twofactortype
          },
      set: function(newVal) {
            this.$set(this.user[authSchemaExtUri], 'twofactortype', newVal)
          }
    },
    forcechangepassword: {
      get: function() {
            var ext = this.user[authSchemaExtUri]
            if(ext.changepassword == undefined) {
              this.$set(ext, 'changepassword', false)
              this.user._justLoaded = true
            }
            return ext.changepassword
          },
      set: function(newVal) {
            this.user[authSchemaExtUri].changepassword = newVal
          }
    }
  },
  watch: {
    user: {
      deep: true,
      handler: function(newVal, oldVal) {
        if(this.user._justLoaded) {
          delete this.user._justLoaded
        }
        else {
          this.enableSave = true
        }
      }
    },
    userJsonText: {
      handler: function(newVal, oldVal) {
        if(oldVal != '') {
          this.enableJsonSave = true
        }

        if(newVal == '') {
          this.enableJsonSave = false
        }
      }
    }
  },
  created() {
    this.showUser()
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
      //console.log(JSON.stringify(this.user))
      // call update if the user already exists
      if(this.user.id != null) {
        this.update()
        return
      }

      axios.post("/v2/Users", this.user, sp.AXIOS_SCIM_CREATE_CONFIG).then(resp => {
        sp.normalizeKeys(resp.data)
        console.log('received')
        console.log(resp.data)
        // initialize 'name' if it is not present
        if(resp.data.name == undefined) {
          resp.data.name = {}
        }
        this.user = resp.data
        // deep clone the object
        this.originalUser = JSON.parse(JSON.stringify(resp.data))
        this.enableSave = false
        this.enableJsonSave = false
        this.user._justLoaded = true
      }).catch(e => {
        sp.showErr(e, 'Failed to create user')
      })
    },
    update() {
      var ops = jp.createScimPatch(this.originalUser, this.user, sp.getResType('user'))
      //console.log(JSON.stringify(ops))
      //console.log(JSON.stringify(this.originalUser))
      //console.log(JSON.stringify(this.user))

      var gOps = [] // groups operations
      for(var i=ops.length -1; i>=0; i--) {
        if(ops[i].path.startsWith('groups')) {
          gOps.push(ops[i])
          ops.splice(i, 1)
        }
      }
      if(gOps.length > 0) {
        sp.showWait()
        // remove or replace operations can contain duplicate keys
        var removeIdMap = {}
        var data = {userrid: this.user.id, addgids: [], removegids: []}
        gOps.forEach(o => {
          if(o.op == 'add')  {
              o.value.forEach(e => {
              data.addgids.push(e.value)
            })
          }
          else {
              var p = o.path
              var start = p.indexOf('\"')
              var end = p.lastIndexOf('\"')
              var gid = p.substring(start+1, end)
            if(o.op == 'remove') {
              // only delete when .$ref and other non-value attributes are not present
              if(p.indexOf('.') == -1 || p.endsWith('.value')) {
                removeIdMap[gid] = 1
              }
            } else if(o.op == 'replace') {
              if(p.endsWith('.value')) {
                removeIdMap[gid] = 1
                data.addgids.push(o.value)
              }
            }
          }
        })
        for(var k in removeIdMap) {
          if(removeIdMap.hasOwnProperty(k)) {
            data.removegids.push(k)
          }
        }

        //console.log(JSON.stringify(data))
        //console.log(JSON.stringify(ops))
        var axiosConf = {headers: {'Content-Type': sp.SCIM_JSON_TYPE, 'If-Match': this.user.meta.version}}
        axios.post("/v2/ModifyGroupsOfUser", data, axiosConf).then(resp => {
          sp.normalizeKeys(resp.data)
          console.log('received after adding groups')
          //console.log(resp.data)
          // initialize 'name' if it is not present
          if(resp.data.name == undefined) {
            resp.data.name = {}
          }
          this.user = resp.data
          // deep clone the object
          this.originalUser = JSON.parse(JSON.stringify(resp.data))
          this.enableSave = false
          this.enableJsonSave = false
          this.user._justLoaded = true
          sp.closeWait()
          this.pathchUser(ops)
        }).catch(e => {
          sp.showErr(e, 'Failed to add user to groups')
        })
      }
      else {
        this.pathchUser(ops)
      }
    },
    pathchUser(ops) {
      if(ops.length == 0) {
        this.enableSave = false
        this.enableJsonSave = false
        return
      }
      console.log(JSON.stringify(ops))
      var patch = {'schemas':['urn:ietf:params:scim:api:messages:2.0:PatchOp'], 'Operations': ops}
      sp.showWait()
      var axiosConf = {headers: {'Content-Type': sp.SCIM_JSON_TYPE, 'If-Match': this.user.meta.version}}
      var url = sp.USERS_URL+this.user.id+'?attributes=*'
      axios.patch(url, patch, axiosConf).then(resp => {
          sp.normalizeKeys(resp.data)
          console.log(resp.data)
          this.user = resp.data
          // deep clone the object
          this.originalUser = JSON.parse(JSON.stringify(resp.data))
          this.enableSave = false
          this.enableJsonSave = false
          this.user._justLoaded = true
          sp.closeWait()
      }).catch(e => {
        sp.showErr(e, '')
      })
    },
    resetPassword() {
      MessageBox.prompt('New password', '', {
          confirmButtonText: 'Reset',
          cancelButtonText: 'Cancel',
          inputType: 'password',
          center: false}
      ).then(action => {
          var ops = [{"op":"replace", "path":"password", "value":action.value}]
          this.pathchUser(ops)
      }).catch(() =>{})
    },
    backToUserList() {
      this.$router.push({path: '/users'})
    },
    showUser() {
      var id = this.$route.params.id
      console.log('route.id => ' + id)
      if(id != 'new') {
        sp.showWait()
        axios.get(sp.USERS_URL+id).then(resp =>{
          sp.normalizeKeys(resp.data)
          console.log(resp.data)
          this.user = resp.data
          // deep clone the object
          this.originalUser = JSON.parse(JSON.stringify(resp.data))
          // initialize 'name' if it is not present
          if(this.user.name == undefined) {
            this.$set(this.user, 'name', {})
          }
          this.user._justLoaded = true
          sp.closeWait()
        }).catch(e =>{
          sp.showErr(e, '')
        })
      }
    },
    saveJson() {
      try {
        var jsonUser = JSON.parse(this.userJsonText)
        if(this.user.id != null) {
          jsonUser.id = this.user.id
          jsonUser.meta = this.user.meta
        }
        this.user = jsonUser
        this.save()
      }
      catch(syntaxErr) {
        console.log(syntaxErr)
        sp.showErr(null, 'Invalid JSON')
      }
    },
    showJson() {
      console.log('current tab -> ' + this.currentTab)
      if(this.currentTab == 'Core') {
        this.userJsonText = ''
      }
    },
    validateJson() {
      console.log('leaving tab -> ' + this.currentTab)
      if(this.currentTab == 'Core') {
        this.userJsonText = JSON.stringify(this.user, null, 2)
        return
      }

      if(this.currentTab == 'JSON View') {
        if(this.enableJsonSave) {
          var self = this
          return new Promise(function(resolve, reject) {
            self.$confirm('Do you want to discard the custom changes made to JSON', 'Warning', {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning',
            center: false
            }).then(action => {
              self.enableJsonSave = false
              self.userJsonText = ''
              resolve(true)
            }).catch(e => {})
        })
      }
    }
    return true
   }
  },
  components: {
    MultiValCa,
    UserGroupsCa
  }
};
</script>
