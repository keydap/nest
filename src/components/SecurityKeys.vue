<template>
  <el-container>
    <el-main>
      <data-tables :data="securityKeys" :table-props="tableProps" :action-col="actionCol" layout="table">
        <el-table-column v-for="col in columns" :prop="col.prop" :label="col.label" :key="col.prop" width="200" header-align="center">
        </el-table-column>
      </data-tables>
      <el-button type="warning" @click="addNewSecurityKey">Add New Security Key</el-button>
    </el-main>
  </el-container>
</template>

<script>
/* eslint-disable */
  import * as sp from "../lib/sparrow"
  import axios from "axios"

  export default {
    name: "SecurityKeys",
    data() {
      return {
        columns: [{
          prop: "deviceId",
          label: "Device ID"
        }, {
          prop: "registeredDate",
          label: "Registered On"
        }, {
          prop: "lastUsedDate",
          label: "Last Used On"
        }],
        tableProps: {
          border: false,
          stripe: true,
          defaultSort: {
            prop: 'deviceId',
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
            handler: this.deleteSecurityKey,
            label: 'Delete'
          }]
        }
      }
    },
    computed: {
      securityKeys() {
        console.log('getting securityKeys from profile')
        var sk = this.$store.state.profile.securityKeys
        console.log(sk)
        return sk
      }
    },
    methods: {
      addNewSecurityKey() {
        sp.showWait()
        var callback = function (skey, err) {
          if(err == null) {
            profile.securityKeys.push(skey)
          }
          else {
            sp.showErr(err, "could not register security key")
          }

          sp.closeWait()
        }

        axios.get(sp.SCIM_BASE_URL + 'pubkeyOptions').then(resp =>{
          sp.registerPubKey(resp.data, callback)
        }).catch(e =>{
          sp.closeWait()
          sp.showErr(e, 'Failed to load credential options')
        })
      },
      deleteSecurityKey(row) {
        console.log(row)
      }
    }
  };
</script>
