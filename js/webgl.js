'use strict'

var glConfig = {
  instance : null,
  clearColor : 0x3300FF00
};

let instance = null;

function checkGLEvnvirnment() {
  console.log("[checkGLEvnvirnment] ===== begin =====");

  let isAllOk       = true;
  let classChecker  = function(className, args) {
    try {
      new className(args);
      console.log("[checkGLEvnvirnment] " + className.name + " ...OK");
      return true;
    } catch (exp) {
      console.error("[checkGLEvnvirnment] " + className.name + " ...Failed\r\n\t", exp);
      return false;
    }
  };
  let shaderChecker = function(shaderID) {
    let elem = document.getElementById(shaderID);
    if (elem != null) {
      if (elem.type == 'x-shader/x-vertex' || elem.type == 'x-shader/x-fragment') {
        console.log("[checkGLEvnvirnment] Shader " + shaderID + " ...OK");
        return true;
      } else {
        console.error("[checkGLEvnvirnment] Shader " + shaderID + " ...Failed");
        return false;
      }
    }
  };

  // GLColor
  isAllOk &= classChecker(Binderer);
  isAllOk &= classChecker(Shader);
  isAllOk &= classChecker(GLColor, 0);
  isAllOk &= classChecker(Material);
  isAllOk &= classChecker(Texture);
  isAllOk &= classChecker(Mesh);
  isAllOk &= classChecker(Model);
  isAllOk &= classChecker(TextureProvider);
  isAllOk &= classChecker(ShaderLoader);
  isAllOk &= classChecker(ModelLoader);
  isAllOk &= classChecker(Plane);
  isAllOk &= classChecker(ImagePlane);

  console.log("[checkGLEvnvirnment] ===== finished =====");
  return isAllOk;
}

function initialize(glInstance) {
  glConfig.clearColor = new GLColor(glConfig.clearColor);
  glConfig.instance   = glInstance;
}

class GLCanvas {
  constructor(glView) {
    instance = this;
    let gl = null;
    try {
      gl = glView.getContext('experimental-webgl');
      glView.glCanvas = this;

      this.mGL              = gl;
      this.mGLView          = glView;
      this.mTextureProvider = new TextureProvider();
      this.mIsGLValid       = true;
      this.mRenderTime      = new Date().getTime();
      console.log('[GLCanvas] create GLCanvas instance');
    } catch (exp) {
      console.error("WebGL isn't support!");
      this.mIsGLValid = false;
    }
  }

  create() {
    console.log('[onGLCreated]');
    this.onGLCreated();
    this.mIsGLValid = checkGLEvnvirnment();
    if (this.mIsGLValid) {
      initialize(this);
      this.loadResources();
    }
  }

  loadResources() {
    console.log('[onResourceLoading]');
    if (!this.mIsGLValid) return;
    this.onGLResourcesLoading();
  }

  resize(width, height) {
    console.log('[onGLResize] size = (' + width + ', ' + height + '), ratio = ' + (width / height));

    if (!this.mIsGLValid) return;
    this.mGL.viewport(0, 0, width, height);
    this.mGL.viewportWidth  = width;
    this.mGL.viewportHeight = height;
    this.mGLView.width      = width;
    this.mGLView.height     = height;
    if (this.mGLView.style != null && this.mGLView.style != 'undefined') {
      this.mGLView.style.width    = width;
      this.mGLView.style.height   = height;
    } else {
      this.mGLView.style          = {};
      this.mGLView.style.width    = width;
      this.mGLView.style.height   = height;
    }
    this.requestRender();
    this.onGLResize(width, height);
  }

  destory() {
    console.log('[onGLDestoryed]');
    this.onGLDestoryed();
  }

  requestRender() {
    if (!instance.mIsGLValid) return;
    requestAnimationFrame(function () {
      let time      = new Date().getTime();
      let deltaTime = time - instance.mRenderTime;
      instance.mRenderTime = time;
      instance.glDrawFrame.call(instance, time, deltaTime);
    });
  }

  getGL() {
    return this.mGL;
  }

  getTextureProvider() {
    return this.mTextureProvider;
  }

  glCreated() {
    console.log('[onGLCreated]');
    this.onGLCreated();
  }

  glDrawFrame(time, deltaTime) {
    if (!this.mIsGLValid) return;
    if (this.mGL == null) {
      console.log('[onDrawFrame] GL is null, cancel render');
      return;
    }

    let gl = this.mGL;
    gl.clearColor(
      glConfig.clearColor.getFloatRed(),
      glConfig.clearColor.getFloatGreen(),
      glConfig.clearColor.getFloatBlue(),
      glConfig.clearColor.getFloatAlpha()
    );
    gl.clear(gl.COLOR_BUFFER_BIT);
    console.log('[onDrawFrame] time = ' + time + ', delta = ' + deltaTime);
    this.onDrawFrame(time, deltaTime);
  }

  onGLCreated() {}
  onGLResourcesLoading() {}
  onGLResize(width, height) {}
  onDrawFrame(time, deltaTime) {}
  onGLDestoryed() {}

  loadShaderProgram(shaderPackage) {
    let program = new Shader();
    return program.loadProgram(this.mGL, shaderPackage);
  }
}
