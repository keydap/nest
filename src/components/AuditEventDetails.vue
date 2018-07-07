<template>
<el-container>
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <el-menu class="el-menu-demo" mode="vertical">
      <el-menu-item index="1" @click="backToEventList">&lt;-Back to List</el-menu-item>
    </el-menu>
  </el-aside>
  <el-main>
    <el-tabs v-model="currentTopTab" type="border-card" @tab-click="tabSelected">
      <el-tab-pane label="Core" name="Core">
        <el-form v-model.lazy="auditevent" :inline="true" label-width="120px" read>
          <el-row justify="start" type="flex">
            <el-form-item label="Operation:">
              <el-input label="Operation" v-model="auditevent.operation" size="small" readonly></el-input>
            </el-form-item>
            <el-form-item label="Status:">
              <el-input label="Status" v-model="auditevent.statuscode" size="small" readonly></el-input>
            </el-form-item>
            <el-form-item label="IP Address:">
              <el-input label="IP Address" v-model="auditevent.ipaddress" size="small" readonly></el-input>
            </el-form-item>
          </el-row>
          <el-row justify="start" type="flex">
            <el-form-item label="Actor's ID:">
              <el-input v-model="auditevent.actorid" style="width: 300px" size="small" readonly></el-input>
            </el-form-item>
            <el-form-item label="Target:">
              <el-input placeholder="" v-model="auditevent.uri" style="width: 400px" size="small" readonly></el-input>
            </el-form-item>
          </el-row>
          <el-row justify="start" type="flex">
            <el-form-item label="Description:">
              <el-input type="textarea" v-model="auditevent.desc" style="width: 300px;" rows="5" size="small" readonly></el-input>
            </el-form-item>
            <el-form-item label="Payload:">
              <el-input type="textarea" v-model="auditevent.payload" style="width: 300px" rows="5" size="small" readonly></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="JSON View(read-only)" name="JSON View">
        <el-input v-model="auditeventJsonText" type="textarea" rows="25" size="medium"></el-input>
      </el-tab-pane>
    </el-tabs>
  </el-main>
  </el-container>
</template>

<script>
/* eslint-disable */
import * as sp from '../lib/sparrow'
import axios from "axios"

export default {
  name: "AuditEventDetails",
  data() {
    return {
    auditevent: {},
    auditeventJsonText: '',
    currentTopTab: 'Core'
    };
  },
  created() {
    this.showEvent()
  },
  methods: {
    backToEventList() {
      this.$router.push({path: '/events'})
    },
    showEvent() {
      var id = this.$route.params.id
      console.log('route.id => ' + id)
      sp.showWait()
      id = encodeURIComponent(id)
      axios.get(sp.AUDIT_EVENTS_URL+id).then(resp =>{
        sp.normalizeKeys(resp.data)
        console.log(resp.data)
        this.auditevent = resp.data
        sp.closeWait()
      }).catch(e =>{
        sp.showErr(e, '')
      })
    },
    tabSelected() {
      if(this.currentTopTab == 'JSON View') {
        this.auditeventJsonText = JSON.stringify(this.auditevent, null, 2)
      }
    }
  }
};
</script>
