<template>
  <div id="app" ref="container"></div>
</template>

<script>
import * as THREE from "three";
import * as Snaba from "./lib/";

export default {
  name: "app",
  data() {
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();
    const container = null;
    const renderer = null;
    const camera = null;
    const guest = null;
    const park = null;
    return {
      scene,
      clock,
      container,
      renderer,
      camera,
      guest,
      park,
    };
  },
  mounted() {
    this.container = this.$refs.container;
    this.init();
    this.tick();
  },
  methods: {
    init() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.container.appendChild(this.renderer.domElement);

      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
      this.camera.position.set(0, 0, +1000);

      this.world = new Snaba.World(this.scene);
      this.guest = new Snaba.Guest(this.camera);

      window.addEventListener('resize', this.resize, false);
    },
    resize() {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.guest.handleResize();
    },
    tick() {
      requestAnimationFrame(this.tick);
      var delta = this.clock.getDelta();
      this.world.update(delta);
      this.guest.update(delta);
      this.renderer.render(this.scene, this.camera);
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
