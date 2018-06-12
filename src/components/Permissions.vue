<template :permissions="permissions" :resName="resName">
  <el-main>
    <el-tabs v-model="currentTab" type="border-card" style="height: 220px;" @tab-click="tabSelected">
      <el-tab-pane label="Read Permission" name="Read Permission">
        <Permission :perm="rp" @perm-modified="permModified"></Permission>
      </el-tab-pane>
      <el-tab-pane label="Write Permission" name="Write Permission">
        <Permission :perm="wp" @perm-modified="permModified"></Permission>
      </el-tab-pane>
    </el-tabs>
  </el-main>
</template>

<script>
/* eslint-disable */
import * as sp from "../lib/sparrow"
import Permission from "./Permission.vue"

export default {
  name: 'Permissions',
  props: {
    permissions: Array,
    resName: String
  },
  data: function() {
    return {
      perms: this.permissions,
      rName: this.resName,
      currentTab: 'Read Permission'
    }
  },
  computed: {
    rp: function() {
      return this.getPerm('read')
    },
    wp: function() {
      return this.getPerm('write')
    }    
  },
methods: {
  getPerm(opName) {
    var obj = null
      for(var i=0; i < this.perms.length; i++) {
        if(this.perms[i].op == opName) {
          obj = this.perms[i]
           break
         }
      }
      if(obj == null) {
        obj = {op: opName}
        this.perms.push(obj)
      }

      console.log(JSON.stringify(obj))
      return obj
  },
  tabSelected() {
    console.log(this.currentTab)
  },
  permModified(p) {
    this.$emit('res-perm-modified', p, this.rName)
  }
},
components: {
  Permission
}
};
</script>
