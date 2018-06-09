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
          <el-tabs style="height: 200px;" tab-position="left" v-model="currentTab" addable closable @edit="handleTabsEdit">
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
    <el-dialog title="Select ResourceType" :visible.sync="dialogVisible" width="30%" center modal @close="addTab">
      <el-select v-model="selectedResType" placeholder="Select">
        <el-option
          v-for="(value, index) in resTypes"
          :key="index"
          :label="value"
          :value="value">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
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
    currentTab: '',
    dialogVisible: false,
    selectedResType: ''
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

      var clonedGroup = this.cloneGroup()
      axios.post("/v2/Groups", clonedGroup, sp.AXIOS_SCIM_CREATE_CONFIG).then(resp => {
        sp.normalizeKeys(resp.data)
        console.log('received')
        console.log(resp.data)
        // deep clone the object
        this.originalGroup = JSON.parse(JSON.stringify(resp.data))
        this.parsePerms(resp.data)
        this.group = resp.data

        var tabs = this.group.permissions
        if(tabs.length > 0) {
          this.currentTab = tabs[0].resname
        }
        
        this.enableSave = false
        this.group._justLoaded = true
      }).catch(e => {
        sp.showErr(e, 'Failed to create group')
      })
    },
    cloneGroup() {
      // cloning is necessary otherwise Vue detects the changes made to this.group 
      // inside forEach loop and throws errors
      var clonedGroup = JSON.parse(JSON.stringify(this.group))
      var tabs = clonedGroup.permissions
      if(tabs != null) {
        tabs.forEach(tab => {
          var str = JSON.stringify(tab.opsarr)
          //str = str.replace('"', '\"')
          tab.opsarr = str
        });
      }
      return clonedGroup      
    },
    update() {
      var clonedGroup = this.cloneGroup()
      var ops = jp.createScimPatch(this.originalGroup, clonedGroup, sp.getResType('group'))
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
          // deep clone the object
          this.originalGroup = JSON.parse(JSON.stringify(resp.data))
          this.parsePerms(this.group)
          this.group = resp.data
          // do not rearrange tabs
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

          var tabs = this.group.permissions
          if(tabs.length > 0) {
            this.currentTab = tabs[0].resname
          }

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
          this.dialogVisible = true
        }
        if (action === 'remove') {
          let tabs = this.group.permissions;
          let activeName = this.currentTab;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.resname === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.resname;
                }
              }
            });
          }
          this.currentTab = activeName;
          this.group.permissions = tabs.filter(tab => tab.resname !== targetName);
        }
      },
      addTab() {
        if(this.selectedResType == '') {
          return
        }
        this.group.permissions.push({
          resname: this.selectedResType,
          opsarr: []
        });
        this.currentTab = this.selectedResType
        this.selectedResType = ''
      },
      cancelDialog() {
        this.selectedResType = ''
        this.dialogVisible = false
      }
  },
  components: {
    Permissions
  },
  computed: {
    resTypes: function() {
      var tmp = sp.getResTypeNames().slice()
      tmp.splice(0, 0, '*')
      var tabs = this.group.permissions
      for(var i=0; i< tabs.length; i++) {
        for(var j=0; j< tmp.length; j++) {
          if(tabs[i].resname == tmp[j]) {
            tmp.splice(j, 1)
            break
          }
        }
      }
      return tmp
    }
  }
};
</script>
