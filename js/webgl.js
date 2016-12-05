var glView   = null;
var glCanvas = null;

function onGLCanvasCreate(id) {
  glView   = document.getElementById(id);
  glCanvas = new GLCanvas(glView);
}

function onGLCanvasResize() {
  if (glView != null && glCanvas != null) {
    glCanvas.resize(glView.width, glView.height);
  }
}

function onGLCanvasDestoryed() {
  if (glCanvas != null) {
    glCanvas.destory();
    glCanvas = null;
  }
  glView = null;
}

class GLCanvas {
  constructor(glView) {
    let gl = null;
    try {
      gl = glView.getContext('experimental-webgl');
      this.mGL = gl;
      this.mRenderTime = new Date().getTime();

      console.log('[GLCanvas] create GLCanvas instance');
    } catch (exp) {
      console.error('WebGL isn\'t support!');
    }
  }

  resize(width, height) {
    console.log('[resize] size = (' + width + ', ' + height + ')');
    this.mGL.viewportWidth  = width;
    this.mGL.viewportHeight = height;
    this.mGL.viewport(width, height);
    this.requestRender();
  }

  destory() {
    // TOGO
  }

  requestRender() {
    requestAnimationFrame(() => {
      let time = new Date().getTime();
      let deltaTime = time - this.mRenderTime;
      this.mRenderTime = time;
      this.onDrawFrame(time, deltaTime);
    });
  }

  onDrawFrame(time, deltaTime) {
    console.log('[onDrawFrame] time = ' + time + ', delta = ' + deltaTime);
    if (this.mGL == null) {
      console.log('[onDrawFrame] GL is null, cancel render');
      return;
    }

    let gl = this.mGL;
    gl.clearColor()
  }
}
