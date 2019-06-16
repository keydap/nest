<template>
  <div class="hello">
    <MultiValCa :metadata="metadata" :complexAt="complexAt"></MultiValCa>
    <!-- <multi-val-ca metadata="metadata" complexAt="complexAt"></multi-val-ca> -->
  </div>
</template>

<script>
import MultiValCa from './MultiValCa.vue'
export default {

  name: 'Header',
  data () {
    return {
      metadata: [{name: 'display', decorated: 'Display', type: 'string'}, {name: 'value', decorated: 'Value', type: 'string'}],
      complexAt: [{display: 'home email', value: 'kiran@example.com'}],
      msg: 'Header page'
    }
  },
  components: {
    MultiValCa
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
