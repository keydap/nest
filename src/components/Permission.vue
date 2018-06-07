<template :perm="perm">
  <el-main>
    <el-form ref="form" :model="perm" label-width="135px" :inline="true">
    <el-row justify="start" type="flex">
      <el-form-item label="Allowed Attributes:">
        <el-input v-model="perm.allowAttrs" placeholder="emails" size="small"></el-input>
      </el-form-item>
      <el-form-item label="Denied Attributes:">
          <el-input v-model="perm.denyAttrs" placeholder="ims" size="small"></el-input>
      </el-form-item>
    </el-row>
    <el-row justify="start" type="flex">
      <el-form-item label="Filter:">
        <el-input v-model="perm.filter" placeholder="ANY" size="small"></el-input>
      </el-form-item>
    </el-row>
    </el-form>
  </el-main>
</template>

<script>
/* eslint-disable */
import * as sp from "../lib/sparrow";

export default {
  name: "Permission",
  props: {
    perm: Object
  },
  data: function() {
    return {
      p: this.perm
    }
  },
  methods: {}
};
</script>
