<template>
    <el-row justify="start" type="flex">
      <fieldset style="width: 80%;">
        <legend>Attribute Indexes</legend>
        <div style="float:left; height: 10px; padding-bottom: 45px;">
        <p>
          <b>Note:</b> <i>Unique attributes are automatically indexed by the server whether they are configured here or not.</i>
        </p>
        </div>
        <div style="float: left">
      <div style="float: left; display: inline-block; width:200px; padding-right: 20px;">
        <span>Resource</span>
      <select v-model="selectedResIndex" :size="5" style="width: 100%; min-height: 175px;">
        <option class="el-select-dropdown__item"
          v-for="(n, index) in resNames"
          :key="n"
          :label="n"
          :value="index">
          <span class="option_span_item">{{n}}</span>
        </option>
      </select>
      <div style="padding: 1px;"/>
      <el-button type="success" size="mini" @click="addResource">Add Resource</el-button>
      </div>
      <div style="float: left; display: inline-block; width: 250px;">
        <span>Indexed Attributes</span>
      <select v-model="selectedAttrIndex" :size="5" style="width: 100%; display: inline-block; min-height: 175px;">
        <option class="el-select-dropdown__item"
          v-for="(n, index) in indexedAttrs"
          :key="n"
          :label="n"
          :value="index">
          {{index+1}}. <span class="option_span_item">{{n}}</span>
        </option>
      </select>
      </div>
      <div style="float: left; display: inline-block; padding: 65px 0px 0px 1px;">
        <el-button type="success" size="mini" round @click="addIndexField">+</el-button>
        <br/>
        <br/>
        <el-button type="warning" size="mini" round @click="removeIndexField">-</el-button>
      </div>
        </div>
      </fieldset>
    </el-row>
</template>

<script>
/* eslint-disable */
import * as sp from "../lib/sparrow"
import axios from "axios"

export default {
  name: "ResourceSettings",
  props: ['resources'],
  data() {
    return {
      selectedResIndex : 0,
      selectedAttrIndex : -1
    }
  },
  computed: {
    resNames: {
      get: function() {
        let resources = this._props['resources']
        let arr = []
        for(let i=0; i< resources.length; i++) {
          let r = resources[i]
          arr.push(r.name)
        }
        return arr
      }
    },
    indexedAttrs: {
      get: function() {
        //this.selectedAttrIndex = -1
        let resources = this._props['resources']
        if(this.selectedResIndex == -1 || resources.length == 0) {
          return []
        }
        
        return resources[this.selectedResIndex].indexFields
      }
    }
  },
  created() {
  },
methods: {
  addIndexField() {

  },
  removeIndexField() {
    if(this.selectedResIndex == -1) {
      return
    }
    if(this.selectedAttrIndex == -1) {
      return
    }

    let resources = this._props['resources']
    resources[this.selectedResIndex].indexFields.splice(this.selectedAttrIndex, 1)
  },
  addResource() {

  }
}    
};
</script>
<style>
/*copied from el-select-dropdown__item , the only change is removal of color attribute */
.option_span_item {
	font-size: 14px;
	padding: 0 20px;
	position: relative;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	/* color: #606266; */
	height: 34px;
	line-height: 34px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	cursor: pointer;
}
</style>
