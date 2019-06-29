import * as THREE from "three";

// FIXME : 三人称視点

let lat = 0;
let lon = 0;

let lookDirection = new THREE.Vector3();
let spherical = new THREE.Spherical();
let target = new THREE.Vector3();

let targetPosition = new THREE.Vector3();

function bind(scope, fn) {
  return function () {
    fn.apply(scope, arguments);
  };
}

let _onContextMenu;
let _onMouseMove;
let _onKeyDown;
let _onKeyUp;

export default class {

  // constructor
  constructor(camera) {

    this.camera = camera;

    this.enabled = false;

    this.movementSpeed = 100.0;
    this.lookSpeed = 0.125;

    this.autoForward = false;

    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.heightMax = 1.0;

    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;

    this.autoSpeedFactor = 0.0;

    this.mouseX = 0;
    this.mouseY = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.update();

    _onContextMenu = bind(this, this.onContextMenu);
    _onMouseMove = bind(this, this.onMouseMove);
    _onKeyDown = bind(this, this.onKeyDown);
    _onKeyUp = bind(this, this.onKeyUp);

    document.addEventListener("contextmenu", _onContextMenu, false);
    document.addEventListener("mousemove", _onMouseMove, false);
    window.addEventListener("keydown", _onKeyDown, false);
    window.addEventListener("keyup", _onKeyUp, false);

    this.setOrientation();
  }

  onMouseMove(ev) {
    if (this.enabled === false) {
      return;
    }
    this.mouseX += ev.movementX;
    this.mouseY += ev.movementY;
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
      case 82:  // r
        this.moveUp = true;
        break;
      case 70:  // f
        this.moveDown = true;
        break;
      case 32:  // space
        // if (this.canJump === true) velocity.y += 350;
        // this.canJump = false;
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
      case 82:  // r
        this.moveUp = false;
        break;
      case 70:  // f
        this.moveDown = false;
        break;
      case 32:  // space
        break;
    }
  }

  onContextMenu(ev) {
    ev.preventDefault();
  }

  lookAt(x, y, z) {
    if (x.isVector3) {
      target.copy(x);
    } else {
      target.set(x, y, z);
    }
    this.camera.lookAt(target);
    this.setOrientation();
  }

  update(delta) {
    if (this.enabled === false) {
      return;
    }
    if (this.heightSpeed) {
      let y = THREE.Math.clamp(this.camera.position.y, this.heightMin, this.heightMax);
      let heightDelta = y - this.heightMin;
      this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);
    } else {
      this.autoSpeedFactor = 0.0;
    }
    let actualMoveSpeed = delta * this.movementSpeed;
    if (this.moveForward || (this.autoForward && ! this.moveBackward)) {
      this.camera.translateZ(- (actualMoveSpeed + this.autoSpeedFactor));
    }
    if (this.moveBackward) {
      this.camera.translateZ(actualMoveSpeed);
    }
    if (this.moveLeft) {
      this.camera.translateX(- actualMoveSpeed);
    }
    if (this.moveRight) {
      this.camera.translateX(actualMoveSpeed);
    }
    if (this.moveUp) {
      this.camera.translateY(actualMoveSpeed);
    }
    if (this.moveDown) {
      this.camera.translateY(- actualMoveSpeed);
    }
    let actualLookSpeed = delta * this.lookSpeed;
    let verticalLookRatio = 1;
    if (this.constrainVertical) {
      verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
    }
    // lon -= this.mouseX * actualLookSpeed;
    lon -= this.mouseX * 0.4;
    this.mouseX = 0;
    // lat -= this.mouseY * actualLookSpeed * verticalLookRatio;
    lat -= this.mouseY * 0.4;
    this.mouseY = 0;
    lat = Math.max(- 85, Math.min(85, lat));
    let phi = THREE.Math.degToRad(90 - lat);
    let theta = THREE.Math.degToRad(lon);
    if (this.constrainVertical) {
      phi = THREE.Math.mapLinear(phi, 0, Math.PI, this.verticalMin, this.verticalMax);
    }
    var position = this.camera.position;
    targetPosition.setFromSphericalCoords(1, phi, theta).add(position);
    this.camera.lookAt(targetPosition);
  }

  dispose() {
    document.removeEventListener("contextmenu", _onContextMenu, false);
    document.removeEventListener("mousemove", _onMouseMove, false);
    window.removeEventListener("keydown", _onKeyDown, false);
    window.removeEventListener("keyup", _onKeyUp, false);
  }

  setOrientation() {
    lookDirection.set(0, 0, -1).applyQuaternion(this.camera.quaternion);
    spherical.setFromVector3(lookDirection);
    lat = 90 - THREE.Math.radToDeg(spherical.phi);
    lon = THREE.Math.radToDeg(spherical.theta);
  }
};
