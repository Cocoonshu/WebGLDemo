'use strict'

var imageProgram = {
  "mProgramName" : "ImageProgram",
  "mShaderArray" : [
    {"mShaderID" : "base_vs"},
    {"mShaderID" : "base_fs"}
  ],
  "mProgram" : null
};

var imageModel = {
  "mName" : "ImageBorad",
  "mMesh" : [
    {
      "mName" : "#1",
      "mDrawMode" : "TRIANGLES",
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
      "mName" : "#1",
      "mDiffuse" : {
        "mColor" : [1.0, 1.0, 1.0, 1.0],
        "mTexture" : "http://imglf1.ph.126.net/-3lep3TrVOKH0mgQEnc9rw==/6630489422582399713.jpg"
      }
    }
  ]
};

/**
 *
 */



/**
 * GLImageView
 */
class GLImageView extends GLCanvas {
  constructor(glView) {
    super(glView);

    this.mImagePlane = null;
    this.mModel      = null;
  }

  onGLCreated() {
    console.log("@@ [onGLCreated]");
  }

  onGLResourcesLoading() {
    console.log("@@ [onGLResourcesLoading]");
    imageProgram.mProgram = this.loadShaderProgram(imageProgram);

    this.mModel = Model.loadFromJSON(imageModel);
    this.mModel.upload(this.getGL());

    this.mImagePlane = new ImagePlane();
    this.mImagePlane.upload(this.getGL());
  }

  onGLResize(width, height) {
    console.log("@@ [onGLResize]");
  }

  onDrawFrame(time, deltaTime) {
    console.log("@@ [onDrawFrame]");
    let gl = this.getGL();
    this.mImagePlane.draw(gl);
    this.mModel.draw(gl);
  }

  onGLDestoryed() {
    console.log("@@ [onGLDestoryed]");
  }
}
