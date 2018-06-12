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
        <el-table-column prop="displayname" label="Name" width="200" align="left">
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
  name: "GroupList",
  data() {
    return {
      resources: [],
      activeIndex: "1",
      multipleSelection: []
    }
    },
    created() {
      // DO NOT load members
      var url = sp.GROUPS_URL+'?attributes=displayName,permissions'
      sp.showWait(this);
      axios.get(url).then(resp => {
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
        console.log(val.username)
        this.$router.push({name: "GroupDetails", params: val});
      },
      addRes(val) {
        this.$router.push({name: "GroupDetails", params: {id: 'new'}});
      },
      deleteRes() {
        this.multipleSelection.forEach(res => {
          axios.delete(sp.GROUPS_URL+res.id).then(resp =>{
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