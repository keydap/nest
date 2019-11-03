<template>
<el-container>
  <el-aside width="200px" style="background-color: #545c64">
    <el-menu class="el-menu-demo" mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1" @click="save" v-if="enableSave">Save</el-menu-item>
      <el-menu-item index="2" @click="deleteMembers" v-if="selectedMembers.length > 0">Delete Members</el-menu-item>
      <el-menu-item index="3" @click="userDialogVisible = true">Add Member</el-menu-item>
      <el-menu-item index="4" @click="backToGroupList">&lt;-Back to List</el-menu-item>
    </el-menu>
  </el-aside>
  <el-main>
    <el-tabs v-model="currentTopTab" type="border-card" @tab-click="tabSelected">
      <el-tab-pane label="Core" name="Core">
        <el-form v-model.lazy="group" :inline="true" label-width="120px">
          <el-row justify="start" type="flex">
            <el-form-item label="Name:">
              <el-input label="Name" placeholder="Name" v-model="group.displayname" size="small"></el-input>
            </el-form-item>
          </el-row>
          <el-row justify="space-between" type="flex">
            <span><b><u>Permissions:</u></b></span>
          </el-row>
        <el-row justify="start" type="flex">
          <el-tabs style="height: 250px;" tab-position="left" v-model="currentTab" addable closable @edit="handleTabsEdit">
            <el-tab-pane v-for="item in group.permissions" :key="item.value" :label="item.value" :name="item.value">
              <Permissions :permissions="item.opsarr" :resName="item.value" @res-perm-modified="resPermModified"></Permissions>
            </el-tab-pane>
          </el-tabs>
        </el-row>
        <el-row justify="center" type="flex">
          <br/>
          <span>&nbsp;</span>
          <br/><br/><br/><br/>
        </el-row>
        <!-- load and show users separately instead of fethcing it from the Group instance that contains displayName and permissions
          this makes patch operation efficient  -->
        <el-row justify="start" type="flex">
          <span><b><u>Member Users:</u></b></span>
        </el-row>
        <el-row justify="start" type="flex">
            <el-row>
              <el-col>
                <el-input v-model="filters[0].value" placeholder="search"></el-input>
              </el-col>
            </el-row>
        </el-row>
        <el-row justify="start" type="flex">
          <data-tables :data="members" :table-props="tableProps" :page-size="10" :pagination-props="{ background: true, pageSizes: [10, 20, 50, 100] }" :filters="filters" highlight-current-row @row-click="showUser" @selection-change="changeSelectedMembers">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column v-for="col in columns" :prop="col.prop" :label="col.label" :key="col.label" sortable="custom" width="200" header-align="center">
          </el-table-column>
            <el-table-column prop="active" label="Active" width="70">
              <template slot-scope="scope">
                <el-button type="success" size="mini" round v-if="scope.row.active == true"></el-button>
                <el-button type="warning" size="mini" round v-else></el-button>
              </template>
            </el-table-column>
          </data-tables>
        </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="JSON View (read-only)" name="JSON View">
        <el-input v-model="groupJsonText" type="textarea" rows="25" size="medium" readonly></el-input>
      </el-tab-pane>
    </el-tabs>
    <!-- dialog for selecting a resource -->
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
        <el-button type="primary" @click="dialogVisible = false">Ok</el-button>
      </span>
    </el-dialog>
    <!-- END of dialog for selecting a resource -->
    <!-- dialog for selecting a user -->
    <el-dialog title="Select User" :visible.sync="userDialogVisible" width="30%" center modal>
      <el-autocomplete v-model="selectedUsername" :fetch-suggestions="searchUsers" value-key="username" @select="handleSearchUserSelection" placeholder="Input Username">
      </el-autocomplete>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUserToGroup">Add</el-button>
      </span>
    </el-dialog>
    <!-- END of dialog for selecting a user -->
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
    currentTopTab: 'Core',
    dialogVisible: false,
    selectedResType: '',
    userDialogVisible: false,
    selectedUser: {},
    selectedUsername: '',
    members: [],
    selectedMembers: [],
      columns: [{
          prop: "username",
          label: "Username"
          }
      ],
     tableProps: {
        border: false,
        stripe: true,
        defaultSort: {
          prop: 'username',
          order: 'ascending'
        }
     },
      filters: [
        {
          prop: ['username'],
          value: ''
        }
      ]
    };
  },
  watch: {
    group: {
      deep: true,
      handler: function(newVal, oldVal) {
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
        // deep clone the object
        this.originalGroup = JSON.parse(JSON.stringify(resp.data))
        this.parsePerms(resp.data)
        this.group = resp.data

        var tabs = this.group.permissions
        if(tabs.length > 0) {
          this.currentTab = tabs[0].resname
        }
        sp.addedNewGroup(this.group)
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
          tab.opsarr = str
        });
      }
      return clonedGroup
    },
    update() {
      var clonedGroup = this.cloneGroup()
      var ops = jp.createScimPatch(this.originalGroup, clonedGroup, sp.getResType('group'))
      this.pathchGroup(ops)
    },
    pathchGroup(ops) {
      if(ops.length == 0) {
        this.enableSave = false
        return
      }
      var patch = {'schemas':['urn:ietf:params:scim:api:messages:2.0:PatchOp'], 'Operations': ops}
      sp.showWait()
      var axiosConf = {headers: {'Content-Type': sp.SCIM_JSON_TYPE, 'If-Match': this.group.meta.version}}
      var url = sp.GROUPS_URL+this.group.id+'?attributes=displayname,permissions,members.value'
      axios.patch(url, patch, axiosConf).then(resp => {
          sp.normalizeKeys(resp.data)
          // deep clone the object
          this.originalGroup = JSON.parse(JSON.stringify(resp.data))
          //this.group = {}
          this.group = resp.data
          this.parsePerms(this.group)
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
      if(id != 'new') {
        sp.showWait()
        axios.get(sp.GROUPS_URL+id).then(resp =>{
          sp.normalizeKeys(resp.data)
          // deep clone the object
          this.originalGroup = JSON.parse(JSON.stringify(resp.data))
          this.group = resp.data

          this.parsePerms(this.group)
          var tabs = this.group.permissions
          if(tabs.length > 0) {
            this.currentTab = tabs[0].value
          }

          this.group._justLoaded = true
          sp.closeWait()
          this.loadMembers()
        }).catch(e =>{
          sp.showErr(e, '')
        })
      }
    },
    tabSelected() {
      if(this.currentTopTab == 'JSON View') {
        this.groupJsonText = JSON.stringify(this.group, null, 2)
      }
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
              if (tab.value === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.value;
                }
              }
            });
          }
          this.currentTab = activeName;
          this.group.permissions = tabs.filter(tab => tab.value !== targetName);
        }
      },
    addTab() {
        if(this.selectedResType == '') {
          return
        }
        this.group.permissions.push({
          value: this.selectedResType,
          opsarr: []
        });
        this.currentTab = this.selectedResType
        this.selectedResType = ''
      },
    cancelDialog() {
        this.selectedResType = ''
        this.dialogVisible = false
      },
    addUserToGroup() {
      var ops = [{op: 'add', path: 'members', value:[{value:  this.selectedUser.id}]}]
      var patch = {'schemas':['urn:ietf:params:scim:api:messages:2.0:PatchOp'], 'Operations': ops}
      sp.showWait()
      var axiosConf = {headers: {'Content-Type': sp.SCIM_JSON_TYPE, 'If-Match': this.group.meta.version}}
      var url = sp.GROUPS_URL+this.group.id+'?attributes=meta'
      var m = {}
      Object.assign(m, this.selectedUser)
      axios.patch(url, patch, axiosConf).then(resp => {
          sp.normalizeKeys(resp.data)
          if(resp.data.meta.version == this.group.meta.version) {
            sp.showErr(null, m.username + ' already present in the group')
          }
          else {
            this.group.meta = resp.data.meta
            this.members.push(m)
            sp.showSuccess('Added ' + m.username + ' to group')
          }
          sp.closeWait()
      }).catch(e => {
        sp.closeWait()
        sp.showErr(e, '')
      })
      this.selectedUser = {}
      this.selectedUsername = ''
    },
    searchUsers(queryString, cb) {
      if(queryString == undefined) {
        return
      }
      if(queryString.length < 2) {
        return
      }
      var url = "/v2/Users" + '?attributes=id,username&filter=username CO "' + queryString + '"'
      axios.get(url).then(resp => {
        var users = resp.data.Resources
        sp.normalizeKeys(users)
        cb(users)
      }).catch(e => {
        sp.showErr(e, 'User search failed')
      })
    },
    handleSearchUserSelection(user) {
      this.selectedUser = user
      this.selectedUsername = user.username
    },
    resPermModified(p, resName) {
      this.enableSave = true
      var tabs = this.group.permissions
      for(var i=0; i< tabs.length; i++) {
        if(tabs[i].resname == resName) {
          var ops = tabs[i].opsarr
          if(ops[0].op == p.op) {
            ops[0] = p
          }
          else if(ops[1].op == p.op) {
            ops[1] = p
          }
        }
      }
    },
    showUser(val) {
      this.$router.push({name: "UserDetails", params: val});
    },
    changeSelectedMembers(val) {
      this.selectedMembers = val;
    },
    loadMembers() {
      var gMembers = this.group.members
      if(gMembers == undefined) {
        return
      }
      this.members = []
      gMembers.forEach(m => {
        // m.value is the ID of the user
        var url = sp.USERS_URL + m.value + '?attributes=id,username,active'
        axios.get(url).then(resp => {
          var user = resp.data
          sp.normalizeKeys(user)
          this.members.push({id: user.id, username: user.username, active: user.active})
        }).catch(e => {
          // ignore
        })
      })
    },
    deleteMembers() {
      var ops = []
      var tmpObj = {}
      this.selectedMembers.forEach(m => {
        var o = {op: 'remove', path: 'members[value EQ "' + m.id + '"]'}
        ops.push(o)
        tmpObj[m.id] = true
      })
      this.selectedMembers = []
      var patch = {'schemas':['urn:ietf:params:scim:api:messages:2.0:PatchOp'], 'Operations': ops}
      sp.showWait()
      var axiosConf = {headers: {'Content-Type': sp.SCIM_JSON_TYPE, 'If-Match': this.group.meta.version}}
      var url = sp.GROUPS_URL+this.group.id+'?attributes=meta'
      axios.patch(url, patch, axiosConf).then(resp => {
          sp.normalizeKeys(resp.data)
          this.group.meta = resp.data.meta
          // updating meta enables the save button
          this.group._justLoaded = true
          sp.closeWait()
      }).catch(e => {
        sp.showErr(e, '')
      })
      this.members = this.members.filter(m => {
        return !tmpObj[m.id]
      })
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
}
</script>
