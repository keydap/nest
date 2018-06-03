<template :metadata="metadata" :resource="resource" :complexAt="complexAt">
  <el-main>
    <fieldset>
      <legend>Groups</legend>
        <table>
          <thead v-if="resource[complexAt] != undefined && resource[complexAt].length > 0">
            <th></th>
            <th v-for="(m, index) in metadata" v-bind:key="index">
              <span v-if="m.decorated">
                {{m.decorated}}
              </span>
              <span v-else>
                {{m.name}}
              </span>
            </th>
          </thead>
        <tr v-for="(ca, rowIndex) in resource[complexAt]" v-bind:key="rowIndex">
          <td><span>{{rowIndex+1}}.</span></td>
          <td v-for="(m, colIndex) in metadata" v-bind:key="colIndex">
            <template v-if="m.name == 'display'">
              <el-autocomplete class="inline-input"  v-model="ca[m.name]" v-if="ca[m.name] == undefined"
              :fetch-suggestions="listGroups" placeholder="Group Name" valueKey="displayname" @select="handleSelect">
              </el-autocomplete>

              <!-- <el-input disabled size="small" v-else v-model="ca[m.name]"></el-input> -->
              <label class="el-form-item__label" v-else>{{ca[m.name]}}</label>
            </template>
            <template v-else>
              <!-- <el-input disabled size="small" v-model="ca[m.name]" ></el-input> -->
              <label class="el-form-item__label">{{ca[m.name]}}</label>
            </template>
          </td>
          <td><el-button type="warning" size="mini" round @click="deleteRow($event, rowIndex)">-</el-button></td>
        </tr>
        </table>
        <div align="left">
        <el-button type="success" size="mini" round @click="addGroup">Add</el-button>
        <!-- <el-button type="warning" size="mini" @click="printCa">Print</el-button> -->
        </div>
    </fieldset>
  </el-main>
</template>

<script>
/* eslint-disable */
import * as sp from "../lib/sparrow"

export default {
  name: 'UserGroupsCa',
props: {
  metadata: Array,
  resource: Object,
  complexAt: String
},
methods: {
      deleteRow(event, index) {
        console.log(index)
        this._props.resource[this._props.complexAt].splice(index, 1)
      },
      addGroup(val) {
        if(this._props.resource[this._props.complexAt] === undefined) {
          this.$set(this._props.resource, this._props.complexAt, [])
        }
        var arr = this._props.resource[this._props.complexAt]
        if(arr.length > 0) {
          if(arr[arr.length - 1].value != undefined) { // add another row only if the previous row is filled
            arr.push({})
          }
        }
        else {
          arr.push({})
        }
      },
      listGroups(queryString, cb) {
        var groups = sp.getGroupNamesAndIds().slice()
        var arr = this._props.resource[this._props.complexAt]
        //FIXME inefficient loop
        for(var i=0; i < arr.length; i++) {
          var j = 0
          var found = true
          for(; j < groups.length; j++) {
            if(arr[i].value == groups[j].id) {
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
        var arr = this._props.resource[this._props.complexAt]
        var lastRow = arr[arr.length - 1]
        lastRow.display = group.displayname
        lastRow.value = group.id
      },
      printCa(val) {
        console.log(JSON.stringify(this._props.resource[this._props.complexAt]))
      }
    }
};
</script>
