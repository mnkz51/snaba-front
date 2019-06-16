<template>
  <div id="app">
    <snaba></snaba>
  </div>
</template>

<script>
import Snaba from './components/Snaba.vue'

export default {
  name: 'app',
  components: {
    Snaba
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
