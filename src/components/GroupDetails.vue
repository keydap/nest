<template>
<el-container>
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <el-menu class="el-menu-demo" mode="vertical">
      <el-menu-item index="1" @click="save" v-if="enableSave">Save</el-menu-item>
      <el-menu-item index="2" @click="backToGroupList">&lt;-Back to List</el-menu-item>
    </el-menu>
  </el-aside>
  <el-main>
    <el-tabs type="border-card">
      <el-tab-pane label="Core">
        <el-form v-model.lazy="group" :inline="true" label-width="120px">
          <el-row justify="start" type="flex">
            <el-form-item label="Name:">
              <el-input label="Name" placeholder="Name" v-model="group.displayname" size="small"></el-input>
            </el-form-item>
          </el-row>
        <el-row justify="start" type="flex">
          <el-tabs style="height: 200px;" tab-position="left" v-model="editableTabsValue" addable closable @edit="handleTabsEdit">
            <el-tab-pane v-for="item in group.permissions" :key="item.resname" :label="item.resname" :name="item.resname">
              <Permissions :permissions="item.opsarr"></Permissions>
            </el-tab-pane>
          </el-tabs>
        </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="JSON View" @tab-click="showJson">
        <el-input v-model="groupJsonText" type="textarea" rows="25" size="medium" @focus="showJson"></el-input>
      </el-tab-pane>
    </el-tabs>
  </el-main>
  </el-container>
</template>

<script>
/* eslint-disable */
import * as sp from '../lib/sparrow'
import axios from "axios"
import * as jp from "scim-rfc6902"
import Permissions from './Permissions.vue'
import MessageBox from 'element-ui'

export default {
  name: "GroupDetails",
  data() {
    return {
    group: {schemas: ['urn:ietf:params:scim:schemas:core:2.0:Group'], permissions: []},
    originalGroup: {},
    enableSave: false,
    groupJsonText: '',
    editableTabsValue: ''
    };
  },
  watch: {
    group: {
      deep: true,
      handler: function(newVal, oldVal) {
        //console.log("user changed")
        if(this.group._justLoaded) {
          delete this.group._justLoaded
        }
        else {
          this.enableSave = true
        }
      }
    }
  },
  created() {
    this.showGroup()
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
      // call update if the group already exists
      if(this.group.id != null) {
        this.update()
        return
      }

      axios.post("/v2/Groups", this.group, sp.AXIOS_SCIM_CREATE_CONFIG).then(resp => {
        sp.normalizeKeys(resp.data)
        console.log('received')
        console.log(resp.data)
        // initialize 'name' if it is not present
        if(resp.data.name == undefined) {
          resp.data.name = {}
        }
        this.group = resp.data
        // deep clone the object
        this.originalGroup = JSON.parse(JSON.stringify(resp.data))
        this.enableSave = false
        this.group._justLoaded = true
      }).catch(e => {
        sp.showErr(e, 'Failed to create group')
      })
    },
    update() {
      var ops = jp.createScimPatch(this.originalGroup, this.group)
      console.log(JSON.stringify(ops))
      this.pathchGroup(ops)
    },
    pathchGroup(ops) {
      var patch = {'schemas':['urn:ietf:params:scim:api:messages:2.0:PatchOp'], 'Operations': ops}
      sp.showWait()
      var axiosConf = {headers: {'Content-Type': sp.SCIM_JSON_TYPE, 'If-Match': this.group.meta.version}}
      var url = sp.GROUPS_URL+this.group.id+'?attributes=*'
      axios.patch(url, patch, axiosConf).then(resp => {
          sp.normalizeKeys(resp.data)
          console.log(resp.data)
          this.group = resp.data
          // deep clone the object
          this.originalGroup = JSON.parse(JSON.stringify(resp.data))
          this.enableSave = false
          this.group._justLoaded = true
          sp.closeWait()
      }).catch(e => {
        sp.showErr(e, '')
      })
    },
    backToGroupList() {
      this.$router.push({path: '/groups'})
    },
    showGroup() {
      var id = this.$route.params.id
      console.log('route.id => ' + id)
      if(id != 'new') {
        sp.showWait()
        axios.get(sp.GROUPS_URL+id).then(resp =>{
          sp.normalizeKeys(resp.data)
          console.log(JSON.stringify(resp.data))
          // deep clone the object
          this.originalGroup = JSON.parse(JSON.stringify(resp.data))
          this.group = resp.data
          this.parsePerms(this.group)
          this.group._justLoaded = true
          sp.closeWait()
        }).catch(e =>{
          sp.showErr(e, '')
        })
      }
    },
    showJson() {
      console.log('showing JSON')
      this.groupJsonText = JSON.stringify(this.group, null, 2)
    },
    parsePerms(gr) {
          var perms = gr.permissions
          if(perms == undefined) {
            perms = []
          } else {
            for(var i=0; i< perms.length; i++) {
              perms[i].opsarr = JSON.parse(perms[i].opsarr)
            }
          }
          gr.permissions = perms
    },

    handleTabsEdit(targetName, action) {
        if (action === 'add') {
          MessageBox.prompt('Select Resource', '', {
              confirmButtonText: 'Reset',
              cancelButtonText: 'Cancel',
              inputType: 'password',
              center: false}
          ).then(action => {
              var ops = [{"op":"replace", "path":"password", "value":action.value}]
              this.pathchUser(ops)
          }).catch(() =>{})   
 
          let newTabName = ++this.tabIndex + '';
          this.gr.permissions.push({
            title: 'New Tab',
            name: newTabName,
            content: 'New Tab content'
          });
          this.editableTabsValue = newTabName;
        }
        if (action === 'remove') {
          let tabs = this.gr.permissions;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          
          this.editableTabsValue = activeName;
          this.gr.permissions = tabs.filter(tab => tab.name !== targetName);
        }
      }
  },
  components: {
    Permissions
  }
};
</script>
