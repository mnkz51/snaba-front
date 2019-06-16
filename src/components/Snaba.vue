<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import * as THREE from "three";

const $WIDTH = 640;
const $HEIGHT = 480;

export default {
  name: "Snaba",
  data() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, $WIDTH / $HEIGHT);
    const canvas = null;
    const renderer = null;
    const box = null;
    return {
      scene,
      camera,
      canvas,
      renderer,
      box,
    };
  },
  mounted() {
    this.canvas = this.$refs.canvas
    this.init();
    this.tick();
  },
  methods: {
    init() {
      this.camera.position.set(0, 0, +1000);
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize($WIDTH, $HEIGHT);

      const geometry = new THREE.BoxGeometry(100, 100, 100);
      const material = new THREE.MeshNormalMaterial();
      this.box = new THREE.Mesh(geometry, material);
      this.scene.add(this.box);
    },
    tick() {
      this.box.rotation.y += 0.01;
      this.box.rotation.x += 0.01;
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.tick);
    }
  }
};
</script>
