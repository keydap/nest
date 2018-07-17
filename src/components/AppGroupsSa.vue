<template :resource="resource">
  <el-main>
    <fieldset>
      <legend>Groups Allowed to Access</legend>
        <table>
          <thead>
            <th></th>
            <th>Name</th>
          </thead>
        <tr v-for="(value, key, index) in groups" v-bind:key="key">
          <td><span>{{index+1}}.</span></td>
          <td>
            <template v-if="key == '00'">
              <el-autocomplete class="inline-input"
              :fetch-suggestions="listGroups" placeholder="Group Name" valueKey="displayname" @select="handleSelect">
              </el-autocomplete>
            </template>
            <template v-else>
              <label class="el-form-item__label">{{value}}</label>
            </template>
          </td>
          <td><el-button type="warning" size="mini" round @click="deleteRow($event, key)">-</el-button></td>
        </tr>
        </table>
        <div align="left">
        <el-button type="success" size="mini" round @click="addRow">Add</el-button>
        <!-- <el-button type="warning" size="mini" @click="printCa">Print</el-button> -->
        </div>
    </fieldset>
  </el-main>
</template>

<script>
/* eslint-disable */
import * as sp from "../lib/sparrow"

export default {
  name: 'AppGroupsSa',
  data() {
    return {
      allowedGroups: {}
    }
  },
props: {
  resource: Object,
},
created() {
  this.updateAllowedGroups()
},
computed: {
  groups: function() {
    this.updateAllowedGroups()
    return this.allowedGroups
  }
},
methods: {
      updateAllowedGroups() {
        let gArr = sp.getGroupNamesAndIds()
        let arr = this._props.resource.groupids
        for(let i=0; i< arr.length; i++) {
          let id = arr[i]
          this.$set(this.allowedGroups, id, sp.getNameOfGroup(id))
        }
      },
      deleteRow(event, id) {
        console.log(id)
        let arr = this._props.resource.groupids
        for(let i=0; i< arr.length; i++) {
          let exitingId = arr[i]
          if(exitingId == id) {
            arr.splice(i, 1)
            delete this.allowedGroups[id]
            break
          }
        }
      },
      addRow(event) {
        console.log('adding row ')
        if(this.allowedGroups['00'] == undefined) { // add another row only if the previous row is filled
          this.$set(this.allowedGroups, '00', '')
        }
      },
      listGroups(queryString, cb) {
        var groups = sp.getGroupNamesAndIds().slice()
        var arr = this._props.resource.groupids
        //FIXME inefficient loop
        for(var i=0; i < arr.length; i++) {
          var j = 0
          var found = true
          for(; j < groups.length; j++) {
            if(arr[i] == groups[j].id) {
              found = true;
              break;
            }
          }

          if(found) {
            groups.splice(j, 1)
          }
        }
        // call callback function to return suggestions
        cb(groups);
      },
      handleSelect(group) {
        console.log(group)
        this._props.resource.groupids.push(group.id)
        this.$set(this.allowedGroups, group.id, group.displayname)
        delete this.allowedGroups['00']
      },
      printCa(val) {
        console.log(JSON.stringify(this.allowedGroups))
      }
    }
};
</script>
