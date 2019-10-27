<template>
  <el-container>
    <el-main>
      <el-row justify="start" type="flex">
        <fieldset style="width: 80%;">
          <legend>Replication Peers</legend>
          <data-tables :data="replPeers" :table-props="tableProps" :action-col="actionCol" layout="table">
            <el-table-column v-for="col in columns" :prop="col.prop" :label="col.label" :key="col.prop" width="200" header-align="center" align="center">
            </el-table-column>
          </data-tables>
          <el-row justify="start" type="flex">
            <el-button type="success" @click="dialogVisible = true">New Peer</el-button>
          </el-row>
        </fieldset>
      </el-row>

      <el-row justify="start" type="flex">
        <fieldset style="width: 80%;">
          <legend>Pending Approvals</legend>
          <data-tables :data="apRequests" :table-props="tableProps" :action-col="apActionCol" layout="table">
            <el-table-column v-for="col in apColumns" :prop="col.prop" :label="col.label" :key="col.prop" width="200" header-align="center" align="center">
            </el-table-column>
          </data-tables>
        </fieldset>
      </el-row>

      <!-- dialog for adding a replication peer -->
      <el-dialog title="New Replication Peer" :visible.sync="dialogVisible" width="30%" center modal>
        <el-form>
          <el-form-item label="Hostname:" label-width="100px">
            <el-input v-model="hostname" placeholder="hostname"></el-input>
          </el-form-item>
          <el-form-item label="Port Number:" label-width="100px">
            <el-input v-model.number="port" placeholder="port number"></el-input>
          </el-form-item>
          <el-row justify="center" type="flex">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="sendJoinReq">Send Join Request</el-button>
          </el-row>
        </el-form>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
/* eslint-disable */
import * as sp from "../lib/sparrow"
import axios from "axios"
import {REPL_BASE_URL} from '../lib/sparrow'

  export default {
    name: 'ReplicationSettings',
    data() {
      return {
        replPeers: [],
        hostname: "localhost",
        port: 7090,
        dialogVisible: false,
        columns: [{
          prop: "serverId",
          label: "Peer ID"
        }, {
          prop: "baseUrl",
          label: "URL"
        }, {
          prop: "approvedBy",
          label: "Approved By"
        }, {
            prop: "createdTime",
            label: "Created On"
          }, {
            prop: "lastReqSentTime",
            label: "Last Sent At"
          }, {
            prop: "lastReqFailureTime",
            label: "Last Failure"
          }],
        tableProps: {
          border: false,
          stripe: true,
          defaultSort: {
            prop: 'serverId',
            order: 'ascending'
          }
        },
        actionCol: {
          label: ' ',
          buttons: [{
            props: {
              type: 'primary',
              icon: 'el-icon-delete'
            },
            handler: this.deletePeer,
            label: ''
          }]
        },
        // pending approval table
        apRequests: [],
        apColumns: [{
          prop: "serverId",
          label: "Peer ID"
        }, {
          prop: "host",
          label: "Host"
        }, {
          prop: "port",
          label: "Port"
        }, {
          prop: "sentBy",
          label: "Sent By"
        }, {
          prop: "createdTime",
          label: "Received On"
        }],
        apActionCol: {
          label: ' ',
          buttons: [{
            props: {
              type: 'primary',
              icon: 'el-icon-check'
            },
            handler: this.approvePeer,
            label: 'Approve'
          }]
        }
      }
    },
    created() {
      this.getPeers()
      this.getPendingApprovals()
    },
    methods: {
      getPeers() {
        sp.showWait()
        axios.get(REPL_BASE_URL + 'fetchPeers').then(resp => {
          this.replPeers = resp.data
          sp.closeWait()
        }).catch(e => {
          sp.closeWait()
          sp.showErr(e, 'Failed to load replication peers')
        })
      },
      getPendingApprovals() {
        console.log('getPendingApprovals')
        sp.showWait()
        axios.get(REPL_BASE_URL + 'fetchPendingApprovals').then(resp => {
          this.apRequests = resp.data
          sp.closeWait()
        }).catch(e => {
          sp.closeWait()
          sp.showErr(e, 'Failed to load pending approval requests')
        })
      },
      sendJoinReq() {
        sp.showWait()
        var req = {
          url: REPL_BASE_URL + 'sendJoinReq',
          method: 'post',
          data: 'host=' + this.hostname + '&port=' + this.port,
          config: {headers: sp.AXIOS_FORM_URL_ENCODE_CONFIG}
        }
        axios.request(req).then(resp =>{
          sp.closeWait()
          this.dialogVisible = false
        }).catch(e => {
          console.log(e)
          sp.closeWait()
          sp.showErr(e, 'Request failed')
        })
      },
      deletePeer() {

      },
      approvePeer(apReq) {
        sp.showWait()
        var req = {
          url: REPL_BASE_URL + 'approveJoinReq',
          method: 'post',
          data: 'serverId=' + apReq.serverId,
          config: {headers: sp.AXIOS_FORM_URL_ENCODE_CONFIG}
        }
        axios.request(req).then(resp =>{
          var i = 0
          for(; i< this.apRequests.length; i++) {
            if(this.apRequests[i].serverId == apReq.serverId) {
              break
            }
          }
          this.apRequests.splice(i, 1)
          sp.closeWait()
        }).catch(e => {
          console.log(e)
          sp.closeWait()
          sp.showErr(e, 'Request failed')
        })
      }
    }
  }
</script>
<style>
  .input-label {
    display: inline-block;
    width: 130px;
  }
</style>
