import Noise from "./noise.js";

const WIDTH = 128;
const DEPTH = 128;

const AROUNDS = [
  { x:  1, z:  0},
  { x: -1, z:  0},
  { x:  0, z:  1},
  { x:  0, z: -1},
];

// FIXME: chunkと拡張を考える

export default class {

  // constructor
  constructor() {
    this.data = [];
    this.width = WIDTH;
    this.depth = DEPTH;
    this.halfWidth = this.width / 2;
    this.halfDepth = this.depth / 2;
    this.size = this.width * this.depth;
  }

  // new world
  create() {
    var zet = Math.random() * 100;
    var quality = 2;
    for (var j = 0; j < 4; j++) {
      if (j === 0) {
        for (var i = 0; i < this.size; i++) {
          this.data[i] = 0;
        }
      }
      for (var i = 0; i < this.size; i++) {
        var x = i % this.width;
        var y = (i / this.width) | 0;
        this.data[i] += Noise(x / quality, y / quality, zet) * quality;
      }
      quality *= 4;
    }
    for (var i = 0; i < this.size; i++) {
      this.data[i] = (this.data[i] * 0.2) | 0;
    }
    this.border = [];
    for (let z = 0; z < DEPTH; z++) {
      for (let x = 0; x < WIDTH; x++) {
        let y = this.height(x, z);
        let p = [];
        for (let a = 0; a < AROUNDS.length; a++) {
          let ay = this.height(x + AROUNDS[a].x, z + AROUNDS[a].z);
          if (ay !== y && ay !== y + 1) {
            p[a] = true;
          } else if (a === 0 && x === 0) {
            p[a] = true;
          } else if (a === 1 && x === WIDTH - 1) {
            p[a] = true;
          } else if (a === 2 && z === DEPTH - 1) {
            p[a] = true;
          } else if (a === 3 && z === 0) {
            p[a] = true;
          } else {
            p[a] = false;
          }
        }
        let obj = {
          x: x,
          y: y,
          z: z,
          p: p,
        };
        this.border.push(obj);
      }
    }
  }

  // get height
  height(x, z) {
    return this.data[x + z * this.width];
  }
};
