<template>
  <div id="app" ref="container"></div>
</template>

<script>
import Game from "./lib/snaba.js";

export default {
  name: "app",
  data() {
    const game = null;
    return {
      game,
    };
  },
  mounted() {
    this.container = this.$refs.container;
    this.init();
    this.tick();
  },
  methods: {
    init() {
      this.game = new Game(this.container);
    },
    tick() {
      requestAnimationFrame(this.tick);
      this.game.update();
    }
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
}

canvas {
  display: block;
}
</style>
