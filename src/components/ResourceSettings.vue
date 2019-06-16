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
      <el-button type="success" round size="mini" @click="showResourceDialog">+</el-button>
      <el-button type="warning" round size="mini" @click="deleteResource">-</el-button>
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
        <el-button type="success" size="mini" round @click="showAttrDialog">+</el-button>
        <br/>
        <br/>
        <el-button type="warning" size="mini" round @click="removeIndexField">-</el-button>
      </div>
        </div>
      </fieldset>
    <!-- dialog for selecting a resource -->
    <el-dialog title="Select ResourceType" :visible.sync="dialogVisible" width="30%" center modal @open="setFocusResSelector">
      <el-select ref="resSelector" v-model="selectedNewResType" filterable placeholder="Select" @change="addNewRes" @visible-change="resDialogClose">
        <el-option
          v-for="(value, index) in availableResTypes"
          :key="index"
          :label="value"
          :value="value">
        </el-option>
      </el-select>
    </el-dialog>
    <!-- END of dialog for selecting a resource -->
    <!-- dialog for selecting an attribute -->
    <el-dialog title="Select Attribute" :visible.sync="attrDialogVisible" width="30%" center modal @open="setFocusAttrSelector">
      <el-select ref="attrSelector" v-model="selectedNewAttrName" filterable placeholder="Select" @change="addIndexField" @visible-change="attrDialogClose">
        <el-option
          v-for="(value, index) in availableAttrs"
          :key="index"
          :label="value"
          :value="value">
        </el-option>
      </el-select>
    </el-dialog>
    <!-- END of dialog for selecting an attribute -->
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
      selectedAttrIndex : -1,
      dialogVisible: false,
      selectedNewResType: '',
      availableResTypes: [],
      selectedNewAttrName: '',
      attrDialogVisible: false,
      availableAttrs: []
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
  showAttrDialog() {
    if(this.selectedResIndex == -1) {
      return
    }

    let resources = this._props['resources']
    let resName = resources[this.selectedResIndex].name.toLowerCase()
    let rt = sp.getResType(resName)
    let arr = rt.attrNames.slice()
    let idxFields = resources[this.selectedResIndex].indexFields
    let count = 0
    for(let i=0; i < idxFields.length; i++) {
      if(count == idxFields.length) {
        break
      }

      for(let j=0; j < arr.length; j++) {
        if(idxFields[i].toLowerCase() == arr[j]) {
          arr.splice(j, 1)
          count++
          break
        }
      }
    }

    this.availableAttrs = arr
    this.attrDialogVisible = true
  },
  addIndexField() {
    if(this.selectedResIndex == -1) {
      return
    }
    let resources = this._props['resources']
    resources[this.selectedResIndex].indexFields.push(this.selectedNewAttrName)
    this.attrDialogVisible = false
    this.selectedNewAttrName = ''
  },
  removeIndexField() {
    if(this.selectedResIndex == -1) {
      return
    }
    if(this.selectedAttrIndex == -1) {
      return
    }

    let resources = this._props['resources']
    let arr = resources[this.selectedResIndex].indexFields
    arr.splice(this.selectedAttrIndex, 1)
    let len = arr.length
    if(len <= this.selectedAttrIndex) {
      this.selectedAttrIndex = this.selectedAttrIndex - 1
    }
  },
  showResourceDialog() {
    let tmp = sp.getResTypeNames().slice()
    let resources = this._props['resources']
    for(let i=0; i< resources.length; i++) {
      for(let j=0; j < tmp.length; j++) {
        if(resources[i].name == tmp[j]) {
          tmp.splice(j, 1)
          break
        }
      }
    }
    if(tmp.length > 0) {
      this.availableResTypes = tmp
      this.dialogVisible = true
    }
  },
  addNewRes() {
    this.dialogVisible = false
    if(this.selectedResType == '') {
      return
    }

    let resources = this._props['resources']
    let obj = {name: this.selectedNewResType, indexFields: []}
    resources.push(obj)
    this.selectedNewResType = ''
  },
  deleteResource() {
    if(this.selectedResIndex == -1) {
      return
    }
    let resources = this._props['resources']
    resources.splice(this.selectedResIndex, 1)
    let len = resources.length
    if(len <= this.selectedResIndex) {
      this.selectedResIndex = this.selectedResIndex - 1
    }
  },
  attrDialogClose(dropdownOpened) {
    if(!dropdownOpened) {
      this.attrDialogVisible = false
    }
  },
  resDialogClose(dropdownOpened) {
    if(!dropdownOpened) {
      this.dialogVisible = false
    }
  },
  setFocusAttrSelector() {
    this.$nextTick(function(){
      this.$refs.attrSelector.focus()
    })
  },
  setFocusResSelector() {
    this.$nextTick(function(){
      this.$refs.resSelector.focus()
    })
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
