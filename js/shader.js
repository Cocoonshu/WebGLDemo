'use strict'

class Shader {
  constructor() {
    this.VERTEX_TYPE   = "x-shader/x-vertex";
    this.FRAGMENT_TYPE = "x-shader/x-fragment";

    this.mProgramName = "";
    this.mShaderArray = [];
  }

  loadProgram(gl, programPackage) {
    let shaderArray   = [];
    let shaderCount   = programPackage.mShaderArray.length;
    let shaderProgram = null;
    let isAllSuccess  = true;

    console.log("[loadProgram] start to link program " + programPackage.mProgramName);
    for (let i = 0; i < shaderCount; i++) {
      let shaderID = programPackage.mShaderArray[i].mShaderID;
      let shader   = this.loadShader(gl, programPackage.mShaderArray[i].mShaderID);
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
  }

  loadShader(gl, shaderID) {
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
      if (typeStr.toLowerCase() == this.VERTEX_TYPE) {
        shaderType = gl.VERTEX_SHADER;
      } else if (typeStr.toLowerCase() == this.FRAGMENT_TYPE) {
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
  }
}
