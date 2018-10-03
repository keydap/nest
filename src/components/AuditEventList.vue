<template>
<el-container>
  <el-aside width="200px" style="background-color: #545c64">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
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
       <el-table-column v-for="col in columns" :prop="col.prop" :label="col.label" :key="col.label" sortable="custom" :width="col.width" header-align="center">
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
  name: "AuditEventList",
  data() {
    return {
      resources: [],
      activeIndex: "1",
      multipleSelection: [],
      columns: [{
          prop: "operation",
          label: "Operation",
          width: "200"
          }, {
          prop: "statuscode",
          label: "Status",
          width: "200"
        }, {
          prop: "desc",
          label: "Description",
          width: "600"
        }
      ],
     tableProps: {
        border: false,
        stripe: true,
        defaultSort: {
          prop: 'id',
          order: 'descending'
        }
     },
      filters: [
        {
          prop: ['desc', 'statuscode'],
          value: ''
        }
      ]
    }
    },
    created() {
      sp.showWait(this);
      let url = sp.AUDIT_EVENTS_URL + this.queryFilter()
      axios.get(url).then(resp => {
        sp.normalizeKeys(resp.data.Resources)
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
        if(day < 10) {
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