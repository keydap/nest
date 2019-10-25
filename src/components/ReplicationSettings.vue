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
            <el-button type="success" @click="addPeer">Add Peer</el-button>
          </el-row>
        </fieldset>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
/* eslint-disable */
import * as sp from "../lib/sparrow"
import axios from "axios"

  export default {
    name: 'ReplicationSettings',
    data() {
      return {
        replPeers: [],
        columns: [{
          prop: "serverid",
          label: "Peer ID"
        }, {
          prop: "baseurl",
          label: "URL"
        }, {
          prop: "createdTime",
          label: "Created On"
        }],
        tableProps: {
          border: false,
          stripe: true,
          defaultSort: {
            prop: 'serverid',
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
        }
      }
    },
    methods: {
      getPeers() {
        axios.get(REPL_BASE_URL + '')
      },
      addPeer() {
      },
      deletePeer() {

      }
    }
  }
</script>
