import * as THREE from "three";

// FIXME : 空や雲、夕焼け

const loader = new THREE.TextureLoader();

const Zones = Object.freeze(
  {
    MORNING: {
      times: 90,
      ambientLightColor: new THREE.Color(0xFFFFFF),
      ambientLightIntensity: 0.4,
      directionalLightColor: new THREE.Color(0xFFFFFF),
      directionalLightIntensity: 0.8,
      directionalLightPositionX: 100,
      directionalLightPositionY: 20,
      background: new THREE.Color(0x75D1E0),
    },
    DAYTIME: {
      times: 600,
      ambientLightColor: new THREE.Color(0xFFFFFF),
      ambientLightIntensity: 0.4,
      directionalLightColor: new THREE.Color(0xFFFFFF),
      directionalLightIntensity: 1,
      directionalLightPositionX: 0,
      directionalLightPositionY: 100,
      background: new THREE.Color(0x75D1E0),
    },
    EVENING: {
      times: 90,
      ambientLightColor: new THREE.Color(0xFFFFFF),
      ambientLightIntensity: 0.4,
      directionalLightColor: new THREE.Color(0xFFFFFF),
      directionalLightIntensity: 0.8,
      directionalLightPositionX: -100,
      directionalLightPositionY: 20,
      background: loader.load("textures/background/evening.png"),
    },
    NIGHT: {
      times: 420,
      ambientLightColor: new THREE.Color(0xFFFFFF),
      ambientLightIntensity: 0.2,
      directionalLightColor: new THREE.Color(0xFFFFFF),
      directionalLightIntensity: 0,
      directionalLightPositionX: 0,
      directionalLightPositionY: -100,
      background: new THREE.Color(0x101820),
    },
  }
);

export default class {

  // constructor
  constructor(scene) {

    this.scene = scene;

    // zone
    this.zone = Zones.MORNING;
    this.reminds = this.zone.times;

    // light
    this.ambientLight = new THREE.AmbientLight();
    this.scene.add(this.ambientLight);
    this.directionalLight = new THREE.DirectionalLight();
    this.scene.add(this.directionalLight);

    this.setLighting();
  }

  // set lighting
  setLighting() {
    this.ambientLight.color = this.zone.ambientLightColor;
    this.ambientLight.intensity = this.zone.ambientLightIntensity;
    this.directionalLight.color = this.zone.directionalLightColor;
    this.directionalLight.intensity = this.zone.directionalLightIntensity;
    this.directionalLight.position.set(this.zone.directionalLightPositionX, this.zone.directionalLightPositionY, 50);
    this.scene.background = this.zone.background;
  }

  // update
  update(delta) {
    this.reminds -= delta;
    while (this.reminds <= 0) {
      this.nextZone();
      this.setLighting();
      this.reminds += this.zone.times;
    }
  }

  // nextZone
  nextZone() {
    switch(this.zone) {
      case Zones.MORNING:
        this.zone = Zones.DAYTIME;
        break;
      case Zones.DAYTIME:
        this.zone = Zones.EVENING;
        break;
      case Zones.EVENING:
        this.zone = Zones.NIGHT;
        break;
      case Zones.NIGHT:
        this.zone = Zones.MORNING;
        break;
    }
  }
};
