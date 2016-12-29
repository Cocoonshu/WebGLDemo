'use strict'

class Material extends Binderer {
  constructor(name) {
    super();
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

  attachTextureProvider(textureProvider) {
    for (let texture of this.mTextureSet.values()) {
      texture.attachTextureProvider(textureProvider);
    }
  }

  upload(gl) {
    for (let texture of this.mTextureSet.values()) {
      texture.updateTexture(gl);
    }
  }

  getBinder(gl, binder) {
    if (binder.startsWith(Material.KEY_COLOR)) {
      let colorName = binder.substring(Material.KEY_COLOR.length, binder.length);
      return this.mColorSet.get(colorName);
    } else if (binder.startsWith(Material.KEY_TEXTURE)) {
      let textureName = binder.substring(Material.KEY_TEXTURE.length, binder.length);
      return this.mTextureSet.get(textureName);
    } else {
      return null;
    }
    return null;
  }

  bind(gl, slotName, slotBinderValue) {
    console.warn("[Material] Binding method is not implemented yet");
    return false;
  }
}

Material.KEY_COLOR   = "Color::";
Material.KEY_TEXTURE = "Texture::";
