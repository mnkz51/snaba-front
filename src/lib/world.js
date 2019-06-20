import * as THREE from "three";

export default class {
  constructor(scene) {
    const geometry = new THREE.BoxGeometry(200, 200, 200);
    const material = new THREE.MeshNormalMaterial();
    this.box = new THREE.Mesh(geometry, material);
    scene.add(this.box);

	  this.update = function (delta) {
      this.box.rotation.x += 0.01;
		  this.box.rotation.y += 0.01;
    };
  }
};
