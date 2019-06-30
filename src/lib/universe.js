import * as THREE from "three";

import TimeZone from "./timezone.js";
import World from "./world.js";
import Guest from "./guest.js";
import Visualizer from "./visualizer.js";

// FIXME : もう少し統廃合

const PIECE = 100;

export default class {

  // constructor
  constructor(scene, camera) {

    this.scene = scene;
    this.camera = camera;

    this.timezone = new TimeZone(this.scene);

    this.world = new World();
    this.world.create();

    this.guest = new Guest(this.scene, this.camera);
    this.camera.position.x = this.world.halfWidth * PIECE;
    this.camera.position.y = this.world.height(this.world.halfWidth, this.world.halfDepth) * PIECE + 300;
    this.camera.position.z = this.world.halfDepth * PIECE;

    this.visualizer = new Visualizer();
    this.visualizer.compute(this.scene, this.world.border);
  }

  // update
  update(delta) {
    this.timezone.update(delta);
    this.guest.update(delta);
  }

  // resume
  resume() {
    this.guest.enabled = true;
  }

  // pause
  pause() {
    this.guest.enabled = false;
  }
};
