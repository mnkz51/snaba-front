import * as THREE from "three";

// FIXME : 三人称視点

const PI_2 = Math.PI / 2;

const euler = new THREE.Euler(0, 0, 0, 'YXZ');
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 100);

export default class {

  // constructor
  constructor(scene, camera) {

    this.scene = scene;
    this.camera = camera;

    this.enabled = false;

    this.moveForward = false;
    this.moveLeft = false;
    this.moveBackward = false;
    this.moveRight = false;
    this.canJump = false;

    this.update();

    window.addEventListener("keydown", e => this.onKeyDown(e), false);
    window.addEventListener("keyup", e => this.onKeyUp(e), false);
    document.addEventListener("mousemove", e => this.onMouseMove(e), false);
  }

  update(delta) {

    if (this.enabled === false) {
      return;
    }

    raycaster.ray.origin.copy(this.camera.position);
    raycaster.ray.origin.y -= 50;

    let intersections = raycaster.intersectObjects(this.scene.children);
    let onObject = intersections.length > 0;

    velocity.z -= velocity.z * 10.0 * delta;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.y -= 9.8 * 10.0 * delta;

    direction.z = Number(this.moveForward) - Number(this.moveBackward);
    direction.x = Number(this.moveLeft) - Number(this.moveRight);
    direction.normalize();

    if (this.moveForward || this.moveBackward) {
      velocity.z -= direction.z * 100.0 * delta;
    }
    if (this.moveLeft || this.moveRight) {
      velocity.x -= direction.x * 100.0 * delta;
    }
    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      this.canJump = true;
    }

    let y = this.camera.position.y;
    this.camera.translateZ(velocity.z);
    this.camera.translateX(velocity.x);
    this.camera.position.y = y + velocity.y;
  }

  onKeyDown(ev) {
    switch (ev.keyCode) {
      case 38:  // up
      case 87:  // w
        this.moveForward = true;
        break;
      case 37:  // left
      case 65:  // a
        this.moveLeft = true;
        break;
      case 40:  // down
      case 83:  // s
        this.moveBackward = true;
        break;
      case 39:  // right
      case 68:  // d
        this.moveRight = true;
        break;
      case 32:  // space
        if (this.canJump === true && velocity.y === 0) {
          velocity.y += 40;
        }
        this.canJump = false;
        break;
    }
  }

  onKeyUp(ev) {
    switch (ev.keyCode) {
      case 38:  // up
      case 87:  // w
        this.moveForward = false;
        break;
      case 37:  // left
      case 65:  // a
        this.moveLeft = false;
        break;
      case 40:  // down
      case 83:  // s
        this.moveBackward = false;
        break;
      case 39:  // right
      case 68:  // d
        this.moveRight = false;
        break;
      case 32:  // space
        break;
    }
  }

  onMouseMove(ev) {

    if (this.enabled === false) {
      return;
    }

    let movementX = ev.movementX || ev.mozMovementX || ev.webkitMovementX || 0;
    let movementY = ev.movementY || ev.mozMovementY || ev.webkitMovementY || 0;

    euler.setFromQuaternion(this.camera.quaternion);

    euler.y -= movementX * 0.002;
    euler.x -= movementY * 0.002;

    euler.x = Math.max(- PI_2, Math.min(PI_2, euler.x));

    this.camera.quaternion.setFromEuler(euler);
  }
};
