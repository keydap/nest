<template>
<el-container>
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="vertical">
    </el-menu>
  </el-aside>
  <el-main>
      <el-table :data="resources" row-key="id" height="600" @selection-change="handleSelectionChange" highlight-current-row @current-change="fetchRes">
      <!-- <el-table-column type="selection" width="40"/> -->
        <el-table-column prop="operation" label="Operation" width="150"></el-table-column>
        <el-table-column prop="statuscode" label="Status" width="200"></el-table-column>
        <el-table-column prop="desc" label="Description" width="470"></el-table-column>
      </el-table>
  </el-main>
  </el-container>
</template>

<script>
/* eslint-disable */
import * as sp from "../lib/sparrow"
import axios from "axios"

export default {
  name: "AuditEventList",
  data() {
    return {
      resources: [],
      activeIndex: "1",
      multipleSelection: []
    }
    },
    created() {
      sp.showWait(this);
      let url = sp.AUDIT_EVENTS_URL + this.queryFilter()
      axios.get(url).then(resp => {
        console.log(resp.data.Resources)
        sp.normalizeKeys(resp.data.Resources)
        console.log(resp.data.Resources[0])
        // reverse the array so that the latest events will be shown first
        this.resources = resp.data.Resources.reverse()
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
        this.$router.push({name: "AuditEventDetails", params: val});
      },
      queryFilter() {
        let hourInMillis = 60 * 60 * 1000
        let now = new Date(Date.now() - hourInMillis) // get events generated since the last hour
        //20180706230956
        let dateTime = now.getUTCFullYear() + ''
        let month = (now.getUTCMonth() + 1)
        if(month < 10) {
          dateTime += '0'
        }
        dateTime += month
        
        let day = now.getUTCDate()
        if(month < 10) {
          dateTime += '0'
        }
        dateTime += day

        let hours = now.getUTCHours()
        if(hours < 10) {
          dateTime += '0'
        }
        dateTime += hours

        let minutes = now.getUTCMinutes()
        if(minutes < 10) {
          dateTime += '0'
        }
        dateTime += minutes

        let sec = now.getUTCSeconds()
        if(sec < 10) {
          dateTime += '0'
        }
        dateTime += sec

        let csn = dateTime // this suffix is not needed '.000000Z%23000000%23000%23000000'
        let filter =  '?filter=id GE ' + csn + ' AND NOT operation SW "audit"'

        return filter
      }
    }    
};
</script>