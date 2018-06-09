<template :permissions="permissions">
  <el-main>
    <el-tabs v-model="currentTab" type="border-card" style="height: 200px;" @tab-click="tabSelected">
      <el-tab-pane label="Read Permission" name="Read Permission">
        <Permission :perm="rp"></Permission>
      </el-tab-pane>
      <el-tab-pane label="Write Permission" name="Write Permission">
        <Permission :perm="wp"></Permission>
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
    permissions: Array
  },
  data: function() {
    return {
      perms: this.permissions,
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
  }
},
components: {
  Permission
}
};
</script>
