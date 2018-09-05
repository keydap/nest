<template>
<el-container>
  <el-aside width="200px" style="background-color: #545c64">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1" @click="addRes">Add New</el-menu-item>
      <el-menu-item index="2" @click="deleteRes" v-if="multipleSelection.length > 0">Delete</el-menu-item>
    </el-menu>
  </el-aside>
  <el-main>
      <div style="float: right; margin-bottom: 1px">
        <el-row>
          <el-col>
            <el-input v-model="filters[0].value" placeholder="search"></el-input>
          </el-col>
        </el-row>
      </div>
      <data-tables :data="resources" :table-props="tableProps" :page-size="10" :pagination-props="{ background: true, pageSizes: [10, 20, 50, 100] }" :filters="filters" highlight-current-row @row-click="fetchRes" @selection-change="handleSelectionChange">
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
      multipleSelection: [],
      columns: [{
          prop: "username",
          label: "Username"
          }, {
          prop: "displayname",
          label: "Name"
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
          prop: ['username', 'displayname'],
          value: ''
        }
      ]
    }
    },
    created() {
      sp.showWait(this);
      let query = '?attributes=username,displayname,active'
      axios.get(sp.USERS_URL+query).then(resp => {
        //console.log(resp.data.Resources)
        sp.normalizeKeys(resp.data.Resources)
        //console.log(resp.data.Resources[0])
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