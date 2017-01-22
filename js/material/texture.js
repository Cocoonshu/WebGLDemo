'use strict'

class Texture {
  constructor(url) {
      this.mName            = null;
      this.mTypeName        = null;
      this.mType            = null;
      this.mTextureUrl      = url;
      this.mTextureID       = Texture.InvalidID ;
      this.mTextureProvider = null;
      this.mMipMapLevel     = 0;
      this.mLoadListener    = null;
  }

  setName(name) {
    this.mName = name;
  }

  setTypeName(typeName) {
    this.mTypeName = typeName;
  }

  setMipMapLevel(mipmapLevel) {
    this.mMipMapLevel = mipmapLevel;
  }

  attachTextureProvider(textureProvider) {
    this.mTextureProvider = textureProvider;
    this.requestLoadTexture();
  }

  setLoadListener(listener) {
    this.mLoadListener = listener;
  }

  requestLoadTexture() {
    let that = this;
    this.mTextureProvider.loadTexture(this, function() {
      if (that.mLoadListener != null) {
        that.mLoadListener(that);
      }
    });
  }

  updateTexture(gl) {
    if (this.mType == null) {
      if (this.mTypeName == Texture.TYPE_1D) {
        this.mType = gl.TEXTURE_1D;
      } else if (this.mTypeName == Texture.TYPE_2D) {
        this.mType = gl.TEXTURE_2D;
      } else if (this.mTypeName == Texture.TYPE_3D) {
        this.mType = gl.TEXTURE_3D;
      } else if (this.mTypeName == Texture.TYPE_CubeMap) {
        this.mType = gl.TEXTURE_CUBE_MAP;
      } else {
        console.warn("[updateTexture] The " + this.mTypeName + " of " + this.mName + " isnot supported");
      }
    }

    if (this.mTextureID == Texture.InvalidID && this.mTextureProvider != null) {
      let provider = this.mTextureProvider;
      let image = provider.getImage(this.mTextureUrl);
      if (image != null) {
        let textureID = gl.createTexture();
        if (this.mType == gl.TEXTURE_CUBE_MAP) {
          console.error("[Texture] CubeMap is not supported yet");
          // gl.bindTexture(gl.TEXTURE_CUBE_MAP, textureID);
          // gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, provider.getImage(textureProvider.NegX));
          // gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, provider.getImage(textureProvider.PosX));
          // gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, provider.getImage(textureProvider.NegY));
          // gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, provider.getImage(textureProvider.PosY));
          // gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, provider.getImage(textureProvider.NegZ));
          // gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, provider.getImage(textureProvider.PosZ));
        } else {
          gl.bindTexture(this.mType, textureID);
          gl.texImage2D(this.mType, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          textureID.bindImageUrl = image.src;
        }

        if (this.mMipMapLevel > 0) {
          // if The dimensions of image is not the power of 2, mipmap is not
          // valiable to it
          //gl.generateMipmap(this.mType);
        }
        this.mTextureID = textureID;
      } else {
        this.requestLoadTexture();
      }
    }
  }

  bindTexture(gl, textureUnitIndex) {
    if (this.mTextureID == Texture.InvalidID) {
      this.updateTexture(gl);
    }

    let textureUnit = gl.TEXTURE0 + textureUnitIndex;
    if (this.mTextureID != Texture.InvalidID) {
      let textureType = this.mType;
      textureType = textureType == null ? gl.TEXTURE_2D : textureType;
      gl.activeTexture(textureUnit);
      gl.bindTexture(textureType, this.mTextureID);
    }
  }

  getTexture() {
    return this.mTextureID;
  }

}

Texture.InvalidID    = 0;
Texture.TYPE_1D      = "1D";
Texture.TYPE_2D      = "2D";
Texture.TYPE_3D      = "3D";
Texture.TYPE_CubeMap = "CubeMap";
