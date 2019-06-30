import * as THREE from "three";

import Universe from "./universe.js";

export default class {

  // constructor
  constructor(container) {

    // funcs
    this.onLock = null;
    this.onUnlock = null;

    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    // universe
    this.universe = new Universe(this.scene, this.camera);

    // clock
    this.clock = new THREE.Clock();

    // add event listener
    window.addEventListener('resize', e => this.resize(e), false);
    document.addEventListener("contextmenu", e => this.nomenu(e), false);
    document.addEventListener('pointerlockchange', e => this.locker(e), false);
  }

  // update
  update() {
    this.universe.update(this.clock.getDelta());
    this.renderer.render(this.scene, this.camera);
  }

  // lock
  lock() {
    this.renderer.domElement.requestPointerLock();
  }

  // resize
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // no menu
  nomenu(ev) {
    ev.preventDefault();
  }

  // locker
  locker() {
    if (document.pointerLockElement === this.renderer.domElement) {
      if (this.onLock !== null) {
        this.onLock();
      }
      this.universe.resume();
    } else {
      if (this.onUnlock !== null) {
        this.onUnlock();
      }
      this.universe.pause();
    }
  }
};
