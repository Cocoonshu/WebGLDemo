'use strict'

/**
 * @Require mesh.js
 *          material.js
 */

class Model {
  static loadFromJSON(json) {
    return ModelLoader.loadFromJSON(json);
  }

  static printJSONModelInfo(json) {
    if (json == null) {
      console.log("[JSONModelInfo] json is null");
      return;
    }

    let modelName     = json.mName != null ? json.mName : "[null]";
    let meshArray     = json.mMesh;
    let materialArray = json.mMaterials;
    let programArray  = json.mPrograms;
    let meshCount     = meshArray     == null ? 0 : meshArray.length;
    let materialCount = materialArray == null ? 0 : materialArray.length;
    let programCount  = programArray  == null ? 0 : programArray.length;

    console.log("[JSONModelInfo] ===== Json model =====");
    console.log("[JSONModelInfo] Name: " + modelName);
    console.log("[JSONModelInfo]   Mesh: " + meshCount);
    for (let i = 0; i < meshCount; i++) {
      if (meshArray[i] == null) {
        console.log("[JSONModelInfo]     #" + i + " [null]");
      } else {
        let name         = meshArray[i].mName         != null ? meshArray[i].mName                : "[null]";
        let vertexCount  = meshArray[i].mVertexes     != null ? meshArray[i].mVertexes.length     : "[null]";
        let normalCount  = meshArray[i].mNormals      != null ? meshArray[i].mNormals.length      : "[null]";
        let coordCount   = meshArray[i].mCoordinates  != null ? meshArray[i].mCoordinates.length  : "[null]";
        let colorCount   = meshArray[i].mVertexColors != null ? meshArray[i].mVertexColors.length : "[null]";
        let indiceCount  = meshArray[i].mIndices      != null ? meshArray[i].mIndices.length      : "[null]";
        let drawMode     = meshArray[i].mDrawMode     != null ? meshArray[i].mDrawMode            : "[null]";
        let drawProgram  = meshArray[i].mDrawProgram  != null ? meshArray[i].mDrawProgram         : "[null]";
        let drawMaterial = meshArray[i].mDrawMaterial != null ? meshArray[i].mDrawMaterial        : "[null]";
        console.log("[JSONModelInfo]     #" + i + " name:'" + name + "'");
        console.log("[JSONModelInfo]        mesh:{vertex:" + vertexCount + " normal:" + normalCount + " coordinate:" + coordCount + " color:" + colorCount + " indice:" + indiceCount + "}");
        console.log("[JSONModelInfo]        drawing:{mode:" + drawMode + " program:'" + drawProgram + "' material:'" + drawMaterial + "'}");
      }
    }

    console.log("[JSONModelInfo]   Material: " + materialCount);
    for (let i = 0; i < meshCount; i++) {
      if (materialArray[i] == null) {
        console.log("[JSONModelInfo]     #" + i + " [null]");
      } else {
        let name         = materialArray[i].mName != null ? meshArray[i].mName : "[null]";
        let colorArray   = materialArray[i].mColors;
        let textureArray = materialArray[i].mTextures;
        let colorCount   = colorArray   != null ? colorArray.length   : "0";
        let textureCount = textureArray != null ? textureArray.length : "0";

        console.log("[JSONModelInfo]     #" + i + " name:'" + name + "'\r\n");
        console.log("[JSONModelInfo]        colors: " + colorCount + " {\r\n");
        for (let j = 0; j < colorArray.length; j++) {
          let color      = colorArray[j];
          let colorName  = color.mName  != null ? color.mName : "[null]";
          let colorValue = color.mColor != null ? new GLColor(color.mColor).toHexColor() : "[null]";
          console.log("[JSONModelInfo]          #" + j + " name:" + colorName + "' color:" + colorValue + "\r\n");
        }
        console.log("[JSONModelInfo]        }\r\n");

        console.log("[JSONModelInfo]        textures: " + colorCount + " {\r\n");
        for (let k = 0; k < textureArray.length; k++) {
          let texture      = textureArray[k];
          let textureName  = texture.mName    != null ? texture.mName    : "[null]";
          let textureValue = texture.mTexture != null ? texture.mTexture : "[null]";
          console.log("[JSONModelInfo]          #" + k + " name:" + textureName + "' textureValue:" + textureValue + "\r\n");
        }
        console.log("[JSONModelInfo]        }\r\n");
      }
    }

    console.log("[JSONModelInfo]   Program: " + programCount);
    for (let i = 0; i < programCount; i++) {
      if (programArray[i] == null) {
        console.log("[JSONModelInfo]     #" + i + " [null]");
      } else {
        let name           = programArray[i].mName != null ? programArray[i].mName : "[null]";
        let argumentCount  = programArray[i].mExportArguments != null ? programArray[i].mExportArguments.length : 0;
        let vertexShader   = programArray[i].mVertexShader != null ? (programArray[i].mVertexShader.length + "chars") : "[null]";
        let fragmentShader = programArray[i].mFragmentShader != null ? (programArray[i].mFragmentShader.length + "chars") : "[null]";
        console.log("[JSONModelInfo]     #" + i + " name:'" + name + "' arguments:" + argumentCount + " vertexShader:" + vertexShader + " fragmentShader:" + fragmentShader + "}");
      }
    }

    console.log("[JSONModelInfo] ===== end =====");
  } // #end printJSONModelInfo(json)

  constructor(name) {
    this.mMeshes          = [];
    this.mMaterials       = new Map();
    this.mPrograms        = new Map();
    this.mMeshBuffers     = [];
    this.mIsUploaded      = false;
    this.mName            = name;

    this.mTextureProvider = null;
    this.mRenderRequester = null;
  }

  addMesh(mesh) {
    this.mMeshes.push(mesh);
  }

  addMaterial(material) {
    this.mMaterials.set(material.mName, material);
  }

  addProgram(program) {
    this.mPrograms.set(program.mProgramName, program);
  }

  attachTextureProvider(textureProvider) {
    this.mTextureProvider = textureProvider;
  }

  onResourceUpdated(resource) {
    console.log("[onResourceUpdated] resource '" + resource + "' is updated")
    if (this.mRenderRequester != null) {
      this.mRenderRequester();
    }
  }

  install(gl, textureProvider, requestRender) {
    this.mRenderRequester = requestRender;

    // Materials
    let that = this;
    for (let material of this.mMaterials.values()) {
      material.attachTextureProvider(textureProvider);
      material.setLoadListener(function(resource) {
        that.onResourceUpdated(resource);
      });
      material.upload(gl);
    }

    // Meshes
    for (let i = 0; i < this.mMeshes.length; i++) {
      if (this.mMeshes[i] != null) {
        let mesh     = this.mMeshes[i];
        let material = this.mMaterials.get(mesh.mDrawMaterialName);
        let program  = this.mPrograms.get(mesh.mDrawProgramName);

        mesh.upload(gl);

        // Programs
        if (program != null) {
          program.install(gl, mesh, material);
        }
      }
    }

    this.mIsUploaded = true;
  }

  upload(gl) {
    for (let i = 0; i < this.mMeshes.length; i++) {
      if (this.mMeshes[i] != null) {
        this.mMeshes[i].upload(gl);
      }
    }
    this.mIsUploaded = true;
  }

  isUploaded() {
    return this.mIsUploaded;
  }

  draw(gl, program) {
    for (let i = 0; i < this.mMeshes.length; i++) {
      if (this.mMeshes[i] != null) {
        let mesh     = this.mMeshes[i];
        let material = this.mMaterials.get(mesh.mDrawMaterialName);
        let program  = this.mPrograms.get(mesh.mDrawProgramName);

        if (mesh != null) {
          if (program != null) {
            program.setup(gl, mesh, material);
          }
          gl.drawArrays(mesh.getDrawMode(), 0, mesh.getVertexCount());
        }
      }
    }
  }

}
