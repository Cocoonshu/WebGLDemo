'use strict'

/**
 * @Require mesh.js
 *          material.js
 */

class Model {
  static loadFromJSON(json) {
    Model.printJSONModelInfo(json);
    if (json == null)
      return;

    let meshArray     = json.mMesh;
    let materialArray = json.mMaterials;
    let meshCount     = meshArray == null ? 0 : meshArray.length;
    let materialCount = materialArray == null ? 0 : materialArray.length;
    let model         = new Model(json.mName);

    // Mesh
    for (let i = 0; i < meshCount; i++) {
      if (meshArray[i] == null) {
        continue;
      } else {
        let mesh = new Mesh();
        mesh.setName(meshArray[i].mName != null ? meshArray[i].mName : ("#" + i));
        mesh.fillVertex(meshArray[i].mVertexes);
        mesh.fillNormal(meshArray[i].mNormals);
        mesh.fillCoordinates(meshArray[i].mCoordinates);
        mesh.fillVertexColors(meshArray[i].mVertexColors);
        mesh.fillIndices(meshArray[i].mIndices);
        model.addMesh(mesh);
      }
    }

    // Material
    for (let i = 0; i < meshCount; i++) {
      if (materialArray[i] == null) {
        continue;
      } else {

      }
    }

    return model;
  } // #end loadFromJSON(json)

  static printJSONModelInfo(json) {
    if (json == null) {
      console.log("[JSONModelInfo] json is null");
      return;
    }

    let modelName     = json.mName != null ? json.mName : "[null]";
    let meshArray     = json.mMesh;
    let materialArray = json.mMaterials;
    let meshCount     = meshArray == null ? 0 : meshArray.length;
    let materialCount = materialArray == null ? 0 : materialArray.length;

    console.log("[JSONModelInfo] ===== Json model =====");
    console.log("[JSONModelInfo] Name: " + modelName);
    console.log("[JSONModelInfo]   Mesh: " + meshCount);
    for (let i = 0; i < meshCount; i++) {
      if (meshArray[i] == null) {
        console.log("[JSONModelInfo]     #" + i + " [null]");
      } else {
        let name        = meshArray[i].mName != null ? meshArray[i].mName : "[null]";
        let vertexCount = meshArray[i].mVertexes != null ? meshArray[i].mVertexes.length : "[null]";
        let normalCount = meshArray[i].mNormals != null ? meshArray[i].mNormals.length : "[null]";
        let coordCount  = meshArray[i].mCoordinates != null ? meshArray[i].mCoordinates.length : "[null]";
        let colorCount  = meshArray[i].mVertexColors != null ? meshArray[i].mVertexColors.length : "[null]";
        let indiceCount = meshArray[i].mIndices != null ? meshArray[i].mIndices.length : "[null]";
        console.log("[JSONModelInfo]     #" + i + " name:'" + name + "' vertex:" + vertexCount + " normal:" + normalCount + " coordinate:" + coordCount + " color:" + colorCount + " indice:" + indiceCount);
      }
    }

    console.log("[JSONModelInfo]   Material: " + materialCount);
    for (let i = 0; i < meshCount; i++) {
      if (materialArray[i] == null) {
        console.log("[JSONModelInfo]     #" + i + " [null]");
      } else {
        let name         = materialArray[i].mName != null ? meshArray[i].mName : "[null]";
        let diffuse      = materialArray[i].mDiffuse;
        let diffuseColor = (diffuse != null && diffuse.mColor != null) ? new GLColor(diffuse.mColor).toHexColor() : "[null]";
        let diffuseMap   = (diffuse != null && diffuse.mTexture != null) ? diffuse.mTexture : "[null]";
        console.log("[JSONModelInfo]     #" + i + " name:'" + name + "' diffuse:{color:" + diffuseColor + " texture:'" + diffuseMap + "'}");
      }
    }

    console.log("[JSONModelInfo] ===== end =====");
  } // #end printJSONModelInfo(json)

  constructor(name) {
    this.mMeshes      = [];
    this.mMaterials   = [];
    this.mMeshBuffers = [];
    this.mIsUploaded  = false;
    this.mName        = name;
  }

  addMesh(mesh) {
    this.mMeshes.push(mesh);
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
        this.mMeshes[i].bind(gl);
        // bind material
        console.error("[draw] TODO implemente the Material binding and Program binding");
        gl.drawArrays(this.mMeshes[i].getDrawMode(), 0, this.mMeshes[i].getVertexCount());
      }
    }
  }


}
