'use strict'

class ShaderSource {
  constructor(type, source) {
    this.mSourceType = type;
    this.mSource     = source;
  }
}

class Shader {
  static loadProgramFromHtml(gl, programPackage) {
    let shaderArray   = [];
    let shaderCount   = programPackage.mShaderArray.length;
    let shaderProgram = null;
    let isAllSuccess  = true;

    console.log("[loadProgram] start to link program " + programPackage.mProgramName);
    for (let i = 0; i < shaderCount; i++) {
      let shaderID = programPackage.mShaderArray[i].mShaderID;
      let shader   = Shader.loadShaderFromHtml(gl, programPackage.mShaderArray[i].mShaderID);
      if (shader != null) {
        shaderArray.push(shader);
        isAllSuccess &= true;
      } else {
        isAllSuccess &= false;
      }
    }

    if (isAllSuccess) {
      shaderProgram = gl.createProgram();
      for (let i = 0; i < shaderCount; i++) {
        gl.attachShader(shaderProgram, shaderArray[i]);
      }
      gl.linkProgram(shaderProgram);

      if (gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("[loadProgram] link program " + programPackage.mProgramName + " ...OK");
        return shaderProgram;
      } else {
        console.error("[loadProgram] link program " + programPackage.mProgramName + " ...Failed");
        console.error("[loadProgram] " + gl.getProgramInfoLog(shaderProgram));
        return null;
      }
    }
  } // #end loadProgramFromHtml(gl, programPackage)

  static loadShaderFromHtml(gl, shaderID) {
    let script     = document.getElementById(shaderID);
    let shaderType = "";
    let source     = "";
    if (script == null) {
      return null;
    } else {
      // Source
      let node = script.firstChild;
      while (node) {
        if (node.nodeType == node.TEXT_NODE) {
          source += node.textContent;
        }
        node = node.nextSibling;
      }

      // Type
      let typeStr = script.type;
      if (type.toLowerCase() == Shader.VERTEX_MIME_TYPE
          || type.toLowerCase() == Shader.VERTEX_TYPE) {
        shaderType = gl.VERTEX_SHADER;
      } else if (type.toLowerCase() == Shader.FRAGMENT_MIME_TYPE
                 || type.toLowerCase() == Shader.FRAGMENT_TYPE) {
        shaderType = gl.FRAGMENT_SHADER;
      }
    }

    let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log("[loadShader] compile shader " + shaderID + " ...OK");
      return shader;
    } else {
      console.error("[loadShader] compile shader " + shaderID + " ...Failed");
      console.error("[loadShader] " + gl.getShaderInfoLog(shader));
      return null;
    }
  } // #end loadShaderFromHtml(gl, shaderID)

  constructor(name) {
    this.mProgramName           = name;
    this.mShaderSourceArray     = [];
    this.mShaderExportArguments = [];
    this.mShaderArguments       = new Map();
    this.mShaderArray           = [];
    this.mProgram               = null;
  }

  setVertexShaderSource(vertexShaderSource) {
    this.mShaderSourceArray.push(new ShaderSource(Shader.VERTEX_TYPE, vertexShaderSource));
  }

  setFragmentShaderSource(fragmentShaderSource) {
    this.mShaderSourceArray.push(new ShaderSource(Shader.FRAGMENT_TYPE, fragmentShaderSource));
  }

  setExportArguments(argumentsArray) {
    this.mShaderExportArguments = argumentsArray;
  }

  loadProgram(gl) {
    let shaderArray   = [];
    let shaderCount   = this.mShaderSourceArray.length;
    let shaderProgram = null;
    let isAllSuccess  = true;

    console.log("[loadProgram] start to link program '" + this.mProgramName + "'");
    for (let i = 0; i < shaderCount; i++) {
      let shaderType   = this.mShaderSourceArray[i].mSourceType;
      let shaderSource = this.mShaderSourceArray[i].mSource;
      let shader       = this.loadShader(gl, shaderType, shaderSource);
      if (shader != null) {
        shaderArray.push(shader);
        isAllSuccess &= true;
      } else {
        isAllSuccess &= false;
      }
    }
    this.mShaderArray.slice(0, this.mShaderArray.length);
    this.mShaderArray.push(shaderArray);

    if (isAllSuccess) {
      shaderProgram = gl.createProgram();
      for (let i = 0; i < shaderCount; i++) {
        gl.attachShader(shaderProgram, shaderArray[i]);
      }
      gl.linkProgram(shaderProgram);

      if (gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("[loadProgram] link program '" + this.mProgramName + "' ...OK");
        return shaderProgram;
      } else {
        console.error("[loadProgram] link program '" + this.mProgramName + "' ...Failed");
        console.error("[loadProgram] " + gl.getProgramInfoLog(shaderProgram));
        return null;
      }
    }
  } // #end loadProgram(gl)

  loadShader(gl, type, source) {
    let shaderType       = null;
    let shaderTypeString = null;
    if (type.toLowerCase() == Shader.VERTEX_MIME_TYPE
        || type.toLowerCase() == Shader.VERTEX_TYPE) {
      shaderType = gl.VERTEX_SHADER;
      shaderTypeString = "vertex";
    } else if (type.toLowerCase() == Shader.FRAGMENT_MIME_TYPE
               || type.toLowerCase() == Shader.FRAGMENT_TYPE) {
      shaderType = gl.FRAGMENT_SHADER;
      shaderTypeString = "fragment";
    }

    let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log("[loadShader] compile " + shaderTypeString + " shader ...OK");
      return shader;
    } else {
      console.error("[loadShader] compile " + shaderTypeString + " shader ...Failed");
      console.error("[loadShader] " + gl.getShaderInfoLog(shader));
      return null;
    }
  } // #end loadShader(gl, type, source)

  install(gl) {
    this.mProgram = this.loadProgram(gl);
    this.mShaderArguments.clear();

    if (this.mProgram != null) {
      // Bind exported arguments
      let exportArgumentSize = this.mShaderExportArguments != null ? this.mShaderExportArguments.length : 0;
      for (let i = 0; i < exportArgumentSize; i++) {
        let argument = this.mShaderExportArguments[i];
        if (argument != null) {
          switch (argument.mType) {
            case Shader.TYPE_ATTRIB: {
              console.log("[Shader] Attribute '" + argument.mName + "' install ...OK");
              let location = gl.getAttribLocation(this.mProgram, argument.mName);
              this.mShaderArguments.set(argument.mName, location);
            } break;

            case Shader.TYPE_UNIFORM: {
              console.log("[Shader] Uniform '" + argument.mName + "' install ...OK");
              let location = gl.getUniformLocation(this.mProgram, argument.mName);
              this.mShaderArguments.set(argument.mName, location);
            } break;
          }
        }
      }
    }
  } // #end install(gl)

  setup(gl, mesh, material, transform) {
    gl.useProgram(this.mProgram);

    // Exported arguments assignment
    console.error("[Shader] Exported arguments assignment umimplemented");
    for (let i = 0; i < this.mShaderExportArguments.length; i++) {
        let argument = this.mShaderExportArguments[i];

    }
  }

}

Shader.VERTEX_MIME_TYPE     = "x-shader/x-vertex";
Shader.FRAGMENT_MIME_TYPE   = "x-shader/x-fragment";
Shader.VERTEX_TYPE          = "vertex";
Shader.FRAGMENT_TYPE        = "fragment";
Shader.TYPE_UNIFORM         = "uniform";
Shader.TYPE_ATTRIB          = "attribute";
Shader.TYPE_VARYING         = "varying";
Shader.PRESET_MVMAT         = "MVMatrix";
Shader.PRESET_PMAT          = "PMatrix";
Shader.PRESET_MVPMAT        = "MVPMatrix";
Shader.PRESET_COLOR_ASSET   = "Color::";
Shader.PRESET_TEXTURE_ASSET = "Texture::";
