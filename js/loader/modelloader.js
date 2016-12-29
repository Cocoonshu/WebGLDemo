'use strict'

class ModelLoader {
  static loadFromJSON(json) {
    Model.printJSONModelInfo(json);
    if (json == null)
      return;

    let meshArray     = json.mMesh;
    let materialArray = json.mMaterials;
    let programArray  = json.mPrograms;
    let meshCount     = meshArray     == null ? 0 : meshArray.length;
    let materialCount = materialArray == null ? 0 : materialArray.length;
    let programCount  = programArray  == null ? 0 : programArray.length;
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
        mesh.setDrawModeName(meshArray[i].mDrawMode);
        mesh.setDrawProgramName(meshArray[i].mDrawProgram);
        mesh.setDrawMaterialName(meshArray[i].mDrawMaterial);
        model.addMesh(mesh);
      }
    }

    // Material
    for (let i = 0; i < materialCount; i++) {
      if (materialArray[i] == null) {
        continue;
      } else {
        let material           = new Material();
        let materialColorSet   = materialArray[i].mColors;
        let materialTextureSet = materialArray[i].mTextures;
        material.setName(materialArray[i].mName != null ? materialArray[i].mName : ("#" + i));

        // Color set
        let materialColorSize = materialColorSet == null ? 0 : materialColorSet.length;
        for (let j = 0; j < materialColorSize; j++) {
          if (materialColorSet[j].mColor != null) {
            material.addColor(
              materialColorSet[j].mName != null ? materialColorSet[j].mName : ("#" + j),
              new GLColor(materialColorSet[j].mColor)
            );
          }
        }

        // Texture set
        let materialTextureSize = materialTextureSet == null ? 0 : materialTextureSet.length;
        for (let k = 0; k < materialTextureSize; k++) {
          if (materialTextureSet[k].mTexture != null) {
            let texureName  = materialTextureSet[k].mName != null ? materialTextureSet[k].mName : ("#" + k);
            let textureType = materialTextureSet[k].mType;
            let texture     = new Texture(materialTextureSet[k].mTexture);
            texture.setName(texureName);
            texture.setTypeName(textureType);
            material.addTexture(texureName, texture);
          }
        }

        model.addMaterial(material);
      }
    }

    // Shader program
    for (let i = 0; i < programCount; i++) {
      if (programArray[i] == null) {
        continue;
      } else {
        let program = ShaderLoader.loadFromJSON(programArray[i]);
        if (program != null) {
          if (ShaderLoader.installShaderProgram(program, meshArray, materialArray)) {
            model.addProgram(program);
          } else {
            // Shader program 'program.mName' install failed
            console.error("[ModelLoader] Shader program '" + program.mName + "' install failed");
            continue;
          }
        }
      }
    }

    return model;
  } // #end loadFromJSON(json)

}
