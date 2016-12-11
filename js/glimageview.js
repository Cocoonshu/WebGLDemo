'use strict'

class GLImageView extends GLCanvas {
  constructor(glView) {
    super(glView);
  }

  onGLCreated() {
    console.log("@@ [onGLCreated]");
  }

  onGLResize(width, height) {
    console.log("@@ [onGLResize]");
  }

  onDrawFrame(time, deltaTime) {
    console.log("@@ [onDrawFrame]");
  }

  onGLDestoryed() {
    console.log("@@ [onGLDestoryed]");
  }
}
