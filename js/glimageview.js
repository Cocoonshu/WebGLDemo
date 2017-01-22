'use strict'

var imageModel = {
  "mName" : "ImageBorad",
  "mMesh" : [
    {
      "mName" : "#1",
      "mDrawMode" : "TRIANGLES",
      "mDrawProgram" : "diffuseTexture",
      "mDrawMaterial" : "diffuseTexture",
      "mVertexes" : [
        -0.5, -0.5, 0,
        +0.5, -0.5, 0,
        -0.5, +0.5, 0,
        +0.5, +0.5, 0
      ],
      "mNormals" : [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
      ],
      "mCoordinates" : [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
      ],
      "mVertexColors" : [
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0
      ],
      "mIndices" : [
        0, 1, 2, 3
      ]
    }
  ],

  "mMaterials" : [
    {
      "mName" : "diffuseTexture",
      "mColors" : [
        {
          "mName" : "filterColor",
          "mColor" : [1.0, 1.0, 1.0, 1.0],
        }
      ],
      "mTextures" : [
        {
          "mName" : "diffuse",
          "mType" : "2D",
          "mMipMap" : 0,
          "mTexture" : "img/6630489422582399713.jpg"
        }/*,
        {
          "mName" : "sky",
          "mType" : "CubeMap",
          "mMipMap" : 0,
          "mTexture" : {
            "NegetiveX" : "",
            "NegetiveY" : "",
            "NegetiveZ" : "",
            "PositiveX" : "",
            "PositiveY" : "",
            "PositiveZ" : ""
          }
        }*/
      ]
    }
  ],

  "mPrograms" : [
    {
      "mName" : "diffuseTexture",
      "mExportArguments" : [
        {"mType" : "uniform",   "mName" : "uMatModelView",   "mBinder" : "MVMatrix"}, // implicitly and default, MVMatrix is a constant
        {"mType" : "uniform",   "mName" : "uMatProjection",  "mBinder" : "PMatrix"},  // implicitly and default, PMatrix is a constant

        {"mType" : "attribute", "mName" : "aPosition",       "mBinder" : "mVertexes"},
        {"mType" : "attribute", "mName" : "aNormal",         "mBinder" : "mNormals"},
        {"mType" : "attribute", "mName" : "aCoordinate",     "mBinder" : "mCoordinates"},
        {"mType" : "attribute", "mName" : "aVertexColor",    "mBinder" : "mVertexColors"},
        {"mType" : "uniform",   "mName" : "uDiffuseColor",   "mBinder" : "Color::filterColor"},
        {"mType" : "uniform",   "mName" : "uDiffuseSampler", "mBinder" : "Texture::diffuse"}
      ],
      "mVertexShader" : "attribute vec3 aPosition; attribute vec3 aNormal; attribute vec4 aVertexColor; attribute vec2 aCoordinate; uniform mat4 uMatModelView; uniform mat4 uMatProjection; varying highp vec2 vTextureCoord; void main(void) {gl_Position = uMatProjection * uMatModelView * vec4(aPosition, 1.0); vTextureCoord = aCoordinate;}",
      "mFragmentShader" : "varying highp vec2 vTextureCoord; uniform sampler2D uDiffuseSampler; uniform highp vec4 uDiffuseColor; void main(void) {gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0) * texture2D(uDiffuseSampler, vec2(vTextureCoord.s, vTextureCoord.t));}"
    }
  ]
};

/**
 * For implicitly
 * {"mType" : "uniform",   "mName" : "uMatModelView",   "mBinder" : "MVMatrix",  mBinderValue:null}
 */



/**
 * GLImageView
 */
class GLImageView extends GLCanvas {
  constructor(glView) {
    super(glView);
    this.mModel = null;
  }

  onGLCreated() {
    console.log("@@ [onGLCreated]");
  }

  onGLResourcesLoading() {
    console.log("@@ [onGLResourcesLoading]");
    this.mModel = Model.loadFromJSON(imageModel);
    this.mModel.install(this.getGL(), this.getTextureProvider(), this.requestRender);
  }

  onGLResize(width, height) {
    console.log("@@ [onGLResize]");
  }

  onDrawFrame(time, deltaTime) {
    console.log("@@ [onDrawFrame]");
    let gl = this.getGL();
    this.mModel.draw(gl);
  }

  onGLDestoryed() {
    console.log("@@ [onGLDestoryed]");
  }
}
