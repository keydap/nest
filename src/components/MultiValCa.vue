<template :displayHeader="displayHeader" :metadata="metadata" :resource="resource" :complexAt="complexAt">
  <el-main>
    <fieldset>
      <legend>{{displayHeader}}</legend>
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
            <!-- <input type="checkbox" checked v-if="m.type == 'boolean' && ca[m.name] == true" v-on:click="togglePrimary($event, rowIndex)"/>
            <input type="checkbox" v-else-if="m.type == 'boolean'" v-on:click="togglePrimary($event, rowIndex)"/> -->
            <input type="radio" name="radio" checked v-if="m.type == 'boolean' && ca[m.name] == true" :value="ca[m.name]" v-model="ca[m.name]" @click="togglePrimary($event, rowIndex)"/>
            <input type="radio" name="radio" v-else-if="m.type == 'boolean'" :value="ca[m.name]" v-model="ca[m.name]" @click="togglePrimary($event, rowIndex)"/>
            <el-input size="small" v-else v-model="ca[m.name]"></el-input>
          </td>
          <td><el-button type="warning" size="mini" round @click="deleteRow($event, rowIndex)">-</el-button></td>
        </tr>
        </table>
        <div align="left">
        <el-button type="success" size="mini" round @click="addRow">New</el-button>
        <!-- <el-button type="warning" size="mini" @click="printCa">Print</el-button> -->
        </div>
    </fieldset>
  </el-main>
</template>

<script>
/* eslint-disable */
export default {
  name: 'MultiValCa',
props: {
  metadata: Array,
  resource: Object,
  complexAt: String,
  displayHeader: String
},
methods: {
      deleteRow(event, index) {
        this._props.resource[this._props.complexAt].splice(index, 1)
      },
      addRow(val) {
        if(this._props.resource[this._props.complexAt] === undefined) {
          this.$set(this._props.resource, this._props.complexAt, [])
        }
        this._props.resource[this._props.complexAt].push({})
      },
      togglePrimary(event, index) {
        // FIXME this metod hardcodes the attribute name 'primary'
        // but this can break if the attribute name changes in schema
        var ca = this._props.resource[this._props.complexAt]
          for(var i =0; i < ca.length; i++) {
            if(i == index) {
              ca[i].primary = true
              continue
            }

            ca[i].primary = false
          }
      },
      printCa(val) {
        //console.log(JSON.stringify(this._props.resource[this._props.complexAt]))
      }
    }
};
</script>
