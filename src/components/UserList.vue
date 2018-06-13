<template>
<el-container>
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="vertical">
      <el-menu-item index="1" @click="addRes">Add New</el-menu-item>
      <el-menu-item index="2" @click="deleteRes" v-if="multipleSelection.length > 0">Delete</el-menu-item>
    </el-menu>
  </el-aside>
  <el-main>
      <el-table :data="resources" row-key="id" height="600" @selection-change="handleSelectionChange" highlight-current-row @current-change="fetchRes">
      <el-table-column type="selection" width="40"/>
      <el-table-column prop="username" label="UserName" width="150">
        </el-table-column>
        <el-table-column prop="displayname" label="Name" width="200">
        </el-table-column>
        <el-table-column prop="active" label="Active" width="70">
          <template slot-scope="scope">
            <el-button type="success" size="mini" round v-if="scope.row.active == true"></el-button>
            <el-button type="warning" size="mini" round v-else></el-button>
          </template>
        </el-table-column>
      </el-table>
  </el-main>
  </el-container>
</template>

<script>
/* eslint-disable */
import * as sp from "../lib/sparrow"
import axios from "axios"

export default {
  name: "UserList",
  data() {
    return {
      resources: [],
      activeIndex: "1",
      multipleSelection: []
    }
    },
    created() {
      sp.showWait(this);
      axios.get(sp.USERS_URL).then(resp => {
        console.log(resp.data.Resources)
        sp.normalizeKeys(resp.data.Resources)
        console.log(resp.data.Resources[0])
        this.resources = resp.data.Resources
        sp.closeWait()
      }).catch(e => {
        sp.showErr(e, '')
      })
    },
methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      fetchRes(val) {
        this.$router.push({name: "UserDetails", params: val});
      },
      addRes(val) {
        this.$router.push({name: "UserDetails", params: {id: 'new'}});
      },
      deleteRes() {
        this.multipleSelection.forEach(res => {
          axios.delete(sp.USERS_URL+res.id).then(resp =>{
            for(var i=0; i< this.resources.length; i++) {
              if(this.resources[i].id == res.id) {
                this.resources.splice(i,1)
              }
            }
          }).catch(e => {
            sp.showErr(e, '')
          })
        })
      }
    }    
};
</script>