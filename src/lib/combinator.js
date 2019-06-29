import * as THREE from "three";

// FIXME : もう少し拡張

export default class {

  // constructor
  constructor() {
    this.geometry = new THREE.BufferGeometry();
    this.attributes = null;
    this.indexes = [];
    this.offset = 0;
  }

  // push geometry
  push(geometry) {
    if (this.attributes === null) {
      this.attributes = {};
      for (let name in geometry.attributes) {
        this.attributes[name] = [];
      }
    }
    for (let name in geometry.attributes) {
      this.attributes[name].push(geometry.attributes[name]);
    }
    var index = geometry.index;
    for (let i = 0; i < geometry.index.count; i++) {
      this.indexes.push(geometry.index.getX(i) + this.offset);
    }
    this.offset += geometry.attributes.position.count;
  }

  // get geometry
  combinate() {
    this.geometry.setIndex(this.indexes);
    for (let name in this.attributes) {
      let attribute = this.attributes[name];
      let size = 0;
      for (let i = 0; i < attribute.length; i++) {
        size += attribute[i].array.length;
      }
      let array = new attribute[0].array.constructor(size);
      let offset = 0;
      for (let i = 0; i < attribute.length; i++) {
        array.set(attribute[i].array, offset);
        offset += attribute[i].array.length;
      }
      let merged = new THREE.BufferAttribute(array, attribute[0].itemSize, attribute[0].normalized);
      this.geometry.addAttribute(name, merged);
    }
    return this.geometry;
  }
}
