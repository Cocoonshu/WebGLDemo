'use strict'

class Material {
  constructor(name) {
    this.mName       = name;
    this.mColorSet   = new Map();
    this.mTextureSet = new Map();
  }

  setName(name) {
    this.mName = name;
  }

  addColor(name, color) {
    this.mColorSet.set(name, color);
  }

  findColor(colorName) {
    return this.mColorSet.get(name);
  }

  clearColorSet() {
    this.mColorSet.clear();
  }

  addTexture(name, texture) {
    this.mTextureSet.set(name, texture);
  }

  findTexture(textureName) {
    return this.mTextureSet.get(textureName);
  }

  clearTextureSet() {
    this.mTextureSet.clear();
  }

  upload(gl) {}

  bind(gl) {}
}
