<template>
<el-container>
  <el-aside width="200px" style="background-color: #545c64">
    <el-menu class="el-menu-demo" mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1" @click="save" v-if="enableSave">Save</el-menu-item>
      <el-menu-item-group title="LDAP">
        <el-menu-item index="2" @click="showTemplate('ldap-user.json', 'User')">User</el-menu-item>
        <el-menu-item index="3" @click="showTemplate('ldap-group.json', 'Group')">Group</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="HTML">
        <el-menu-item v-for="(t, i) in htmlTmplList" :index="''+(i + 4)" :key="t.name" @click="showTemplate(t.name, t.title)">{{t.title}}</el-menu-item>
      </el-menu-item-group>
    </el-menu>
  </el-aside>
  <el-main>
    <span><b>{{curTmplTitle}}</b></span>
    <el-input v-model="curTmplData" type="textarea" rows="25" size="medium"></el-input>
  </el-main>
</el-container>
</template>
<script>
/* eslint-disable */
import * as sp from "../lib/sparrow"
import axios from "axios"
export default {
  name: 'SettingsParent',
  data() {
    return {
      enableSave: false,
      changedTmpls: {},
      tmplData: {},
      curTmplName: '',
      curTmplTitle: '',
      htmlTmplList: [{name: 'changepassword.html', title: 'Change Password'},
                 {name: 'consent.html', title: 'Consent'},
                 {name: 'login.html', title: 'Login'},
                 {name: 'saml_response.html', title: 'SAML Response'},
                 {name: 'totp-register.html', title: 'TOTP Registration'},
                 {name: 'totp-send.html', title: 'OTP Form'}]
    }
  },
created() {
  this.showTemplate('ldap-user.json')
},
computed: {
  curTmplData: {
    get() {
      let tmpl = this.tmplData[this.curTmplName]
      if(tmpl == undefined) {
        return ''
      }
      return tmpl.text
    },
    set(newVal) {
      let newHash = this.hashCode(newVal)
      let tmpl = this.tmplData[this.curTmplName]
      if(newHash !== tmpl.hash) {
        tmpl.text = newVal
        this.enableSave = true
        this.changedTmpls[this.curTmplName] = 1
      } else {
        delete this.changedTmpls[this.curTmplName]
        if(Object.keys(this.changedTmpls).length == 0) {
          this.enableSave = false
        }
      }
    }
  }
},
methods: {
  showTemplate(name, title) {
    let tmpl = this.tmplData[name]
    if(tmpl !== undefined) {
      this.curTmplName = name
      this.curTmplTitle = title
      this.curTmplData = tmpl.text
      return
    }
    sp.showWait()
    axios.get(sp.TEMPLATES_URL + '?name=' + name, {transformResponse: (req) => {
            // this is to prevent Axios from parsing the LDAP templates as JSON objects
            return req;
        }}).then(resp =>{
          let text = resp.data
          this.tmplData[name] = {text: text, hash: this.hashCode(text)}
          this.curTmplName = name
          this.curTmplTitle = title
          this.curTmplData = text
          sp.closeWait()
    }).catch(e =>{
      sp.showErr(e, 'Failed to load domain configuration')
    })
  },
  save() {
    for(let k in this.changedTmpls) {
      if(this.changedTmpls.hasOwnProperty(k)) {
        this._save(k, this.tmplData[k].text)
      }
    }
    this.enableSave = false
  },
  _save(name, data) {
    sp.showWait()
    axios.put(sp.TEMPLATES_URL + '?name=' + name, data, {transformResponse: (req) => {
            // this is to prevent Axios from parsing the LDAP templates as JSON objects
            return req;
        }, headers: {'Content-Type': 'text/plain'}}).then(resp =>{
      delete this.changedTmpls[name]
      let text = resp.data
      this.tmplData[name] = {text: text, hash: this.hashCode(text)}
      sp.closeWait()
      sp.showSuccess('Updated template ' + name)
    }).catch(e =>{
      sp.showErr(e, 'Failed to update template ' + name)
    })
  },
  // a direct translation of Java's hashCode() into JavaScript
  hashCode(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
      let char = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
}
};
</script>
