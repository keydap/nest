<template>
  <el-container>
    <el-main>
      <!-- yep the data prop is in lowercase -->
      <data-tables :data="securitykeys" :table-props="tableProps" :action-col="actionCol" layout="table">
        <el-table-column v-for="col in columns" :prop="col.prop" :label="col.label" :key="col.prop" width="200" header-align="center" align="center">
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
  import {MessageBox} from "element-ui"

  export default {
    name: "SecurityKeys",
    data() {
      return {
        columns: [{
          prop: "deviceid",
          label: "Device ID"
        }, {
          prop: "registereddate",
          label: "Registered On"
        }, {
          prop: "lastuseddate",
          label: "Last Used On"
        }],
        tableProps: {
          border: false,
          stripe: true,
          defaultSort: {
            prop: 'deviceid',
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
            label: ''
          }]
        }
      }
    },
    computed: {
      // due to normalization all keys will be in lowercase even if they are sent in camelcased form from server
      securitykeys: {
        get() {
          return this.$store.state.profile.securitykeys
        }
      }
    },
    methods: {
      addNewSecurityKey() {
        var self = this
        sp.showWait()
        var callback = function (skey, err) {
          if(err == null) {
            console.log(skey)
            self.securitykeys.push(skey)
          }
          else {
            sp.showErr(err, "could not register security key")
          }

          sp.closeWait()
        }

        axios.get(sp.SCIM_BASE_URL + 'pubkeyOptions').then(resp =>{
          try {
            sp.registerPubKey(resp.data, callback)
          }
          catch(err) {
            sp.closeWait()
            console.log(err)
            sp.showErr(err, 'Failed to register new credential')
          }
        }).catch(e =>{
          sp.closeWait()
          sp.showErr(e, 'Failed to load credential options')
        })
      },
      deleteSecurityKey(row) {
        console.log(row)
        MessageBox.confirm('Do you want to delete the credential?', 'Warning', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning',
          center: false}
        ).then(() => {
          sp.showWait()
          axios.delete(sp.SCIM_BASE_URL + 'deletePubkey/' + row.credentialid).then(resp =>{
            var i = 0
            for(; i< this.securitykeys.length; i++) {
              if(this.securitykeys[i].credentialid == row.credentialid) {
                break
              }
            }
            this.securitykeys.splice(i, 1)
            sp.closeWait()
          }).catch(e =>{
            sp.closeWait()
            sp.showErr(e, 'Failed to delete the credential')
          })
        }).catch(() => {
          // do nothing
        })
      }
    }
  };
</script>
