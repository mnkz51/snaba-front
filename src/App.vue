<template>
  <div id="app" ref="container">
    <div id="blocker" ref="blocker">
      <div id="instructions" ref="instructions">
        <span class="sub-heading">Click to play</span>
        <br/>
        <br/>
        Move: W, A, S, D<br/>
        Jump: Space<br/>
        Look: Mouse<br/>
      </div>
    </div>
  </div>
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
    this.blocker = this.$refs.blocker;
    this.instructions = this.$refs.instructions;
    this.init();
    this.tick();
  },
  methods: {
    init() {
      let thas = this;
      this.game = new Game(this.container);
      this.game.onLock = this.lock;
      this.game.onUnlock = this.unlock;
      this.instructions.addEventListener("click", e => this.game.lock(e), false);
    },
    tick() {
      requestAnimationFrame(this.tick);
      this.game.update();
    },
    lock() {
      this.instructions.style.display = "none";
      this.blocker.style.display = "none";
    },
    unlock() {
      this.blocker.style.display = "block";
      this.instructions.style.display = "";
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

#blocker {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
}

#instructions {
  width: 100%;
  height: 100%;
  display: -webkit-box;
  display: -moz-box;
  display: box;
  -webkit-box-orient: horizontal;
  -moz-box-orient: horizontal;
  box-orient: horizontal;
  -webkit-box-pack: center;
  -moz-box-pack: center;
  box-pack: center;
  -webkit-box-align: center;
  -moz-box-align: center;
  box-align: center;
  color: #FFFFFF;
  font-size: 16px;
  line-height: 24px;
}

#instructions .sub-heading {
  font-size: 36px;
}
</style>
