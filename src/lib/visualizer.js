import * as THREE from "three";

import Combinator from "./combinator.js";

// FIXME : 行列

const loader = new THREE.TextureLoader();

const blocks = [
  "sample",
];

const matrix = new THREE.Matrix4();

const PIECE = 100;

const pxGeometry = new THREE.PlaneBufferGeometry(PIECE, PIECE);
pxGeometry.rotateY(Math.PI / 2);
pxGeometry.translate(PIECE / 2, 0, 0);

const nxGeometry = new THREE.PlaneBufferGeometry(PIECE, PIECE);
nxGeometry.rotateY(- Math.PI / 2);
nxGeometry.translate(- PIECE / 2, 0, 0);

const pyGeometry = new THREE.PlaneBufferGeometry(PIECE, PIECE);
pyGeometry.rotateX(- Math.PI / 2);
pyGeometry.translate(0, PIECE / 2, 0);

const pzGeometry = new THREE.PlaneBufferGeometry(PIECE, PIECE);
pzGeometry.translate(0, 0, PIECE / 2);

const nzGeometry = new THREE.PlaneBufferGeometry(PIECE, PIECE);
nzGeometry.rotateY(Math.PI);
nzGeometry.translate(0, 0, - PIECE / 2);

export default class {

  // constructor
  constructor() {
    this.materials = {};
    for (let i = 0; i < blocks.length; i++) {
      let name = blocks[i];
      let texture = loader.load("textures/" + name + ".png");
      texture.magFilter = THREE.NearestFilter;
      this.materials[name] = new THREE.MeshLambertMaterial({map: texture, side: THREE.FrontSide});
    }
  }

  // compute
  compute(scene, border) {

    let combinator = new Combinator();

    for (let i = 0; i < border.length; i++) {
      matrix.makeTranslation(border[i].x * PIECE, border[i].y * PIECE, border[i].z * PIECE);
      combinator.push(pyGeometry.clone().applyMatrix(matrix));
      if (border[i].p[0]) {
        combinator.push(pxGeometry.clone().applyMatrix(matrix));
      }
      if (border[i].p[1]) {
        combinator.push(nxGeometry.clone().applyMatrix(matrix));
      }
      if (border[i].p[2]) {
        combinator.push(pzGeometry.clone().applyMatrix(matrix));
      }
      if (border[i].p[3]) {
        combinator.push(nzGeometry.clone().applyMatrix(matrix));
      }
    }

    let geometry = combinator.combinate();
    geometry.computeBoundingSphere();

    var mesh = new THREE.Mesh(geometry, this.materials["sample"]);

    scene.add(mesh);
  }
};
