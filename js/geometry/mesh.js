'use strict'

class Mesh extends Binderer {
  constructor() {
    super();
    this.mName              = null;
    this.mDrawMode          = null;
    this.mDrawModeName      = null;
    this.mDrawProgramName   = null;
    this.mDrawMaterialName  = null;

    this.mVertexes          = null;
    this.mNormals           = null;
    this.mCoords            = null;
    this.mVertexColors      = null;
    this.mIndices           = null;

    this.mVertexBuffer      = null;
    this.mNormalBuffer      = null;
    this.mCoordBuffer       = null;
    this.mVertexColorBuffer = null;

    this.mBinderMap = [
      {key:"mVertexes",     value:this.mVertexBuffer},
      {key:"mNormals",      value:this.mNormalBuffer},
      {key:"mCoordinates",  value:this.mCoordBuffer},
      {key:"mVertexColors", value:this.mVertexColorBuffer}
    ];
  }

  setName(name) {
    this.mName = name;
  }

  attachDrawProgram(program) {
    this.mDrawProgram = program;
  }

  attachDrawMaterial(material) {
    this.mDrawMaterial = material;
  }

  fillVertex(vertexes) {
    this.mVertexes = vertexes;
  }

  fillNormal(normals) {
    this.mNormals = normals;
  }

  fillCoordinates(coords) {
    this.mCoords = coords;
  }

  fillVertexColors(colors) {
    this.mVertexColors = colors;
  }

  fillIndices(indices) {
    this.mIndices = indices;
  }

  setDrawModeName(name) {
    this.mDrawModeName = name;
  }

  setDrawProgramName(name) {
    this.mDrawProgramName = name;
  }

  setDrawMaterialName(name) {
    this.mDrawMaterialName = name;
  }

  setDrawMode(mode) {
    this.mDrawMode = mode;
  }

  getDrawMode() {
    return this.mDrawMode;
  }

  getVertexCount() {
    return this.mVertexes != null ? this.mVertexes.length / 3 : 0;
  }

  buildVertexBuffer(gl) {
    if (this.mVertexes == null)
      return 0;

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mVertexes), gl.STATIC_DRAW);
    return buffer;
  }

  buildNormalBuffer(gl) {
    if (this.mNormals == null)
      return 0;

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mNormals), gl.STATIC_DRAW);
    return buffer;
  }

  buildCoordinateBuffer(gl) {
    if (this.mCoords == null)
      return 0;

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mCoords), gl.STATIC_DRAW);
    return buffer;
  }

  buildVertexColorBuffer(gl) {
    if (this.mVertexColors == null)
      return 0;

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mVertexColors), gl.STATIC_DRAW);
    return buffer;
  }

  parseDrawModeString(gl) {
    if (this.mDrawModeName == null) {
      this.mDrawMode = gl.POINTS;
    } else if (this.mDrawModeName == Mesh.MODE_POINTS) {
      this.mDrawMode = gl.POINTS;
    } else if (this.mDrawModeName == Mesh.MODE_LINES) {
      this.mDrawMode = gl.LINES;
    } else if (this.mDrawModeName == Mesh.MODE_LINE_LOOP) {
      this.mDrawMode = gl.LINE_LOOP;
    } else if (this.mDrawModeName == Mesh.MODE_LINE_STRIP) {
      this.mDrawMode = gl.LINE_STRIP;
    } else if (this.mDrawModeName == Mesh.MODE_TRIANGLES) {
      this.mDrawMode = gl.TRIANGLES;
    } else if (this.mDrawModeName == Mesh.MODE_TRIANGLE_STRIP) {
      this.mDrawMode = gl.TRIANGLE_STRIP;
    } else if (this.mDrawModeName == Mesh.MODE_TRIANGLE_FAN) {
      this.mDrawMode = gl.TRIANGLE_FAN;
    } else {
      this.mDrawMode = gl.POINTS;
    }
    return this.mDrawMode;
  }

  upload(gl) {
    this.mVertexBuffer      = this.buildVertexBuffer(gl);
    this.mNormalBuffer      = this.buildNormalBuffer(gl);
    this.mCoordBuffer       = this.buildCoordinateBuffer(gl);
    this.mVertexColorBuffer = this.buildVertexColorBuffer(gl);
    this.mDrawMode          = this.parseDrawModeString(gl);
    this.mBinderMap         = [
      {key:"mVertexes",     value:this.mVertexBuffer},
      {key:"mNormals",      value:this.mNormalBuffer},
      {key:"mCoordinates",  value:this.mCoordBuffer},
      {key:"mVertexColors", value:this.mVertexColorBuffer}
    ];
  }

  bind(gl, slotName, slotBinderValue) {
    if (gl == null || slotName == -1 || slotName == null || slotBinderValue == null) {
      return false;
    }

    if (slotBinderValue == Mesh.BINDER_VERTEX) {
      if (this.mVertexBuffer != null) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mVertexBuffer);
        gl.enableVertexAttribArray(slotName);
        gl.vertexAttribPointer(slotName, 3, gl.FLOAT, false, 0, 0);
      }
      return true;
    } else if (slotBinderValue == Mesh.BINDER_NORMAL) {
      if (this.mNormalBuffer != null) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mNormalBuffer);
        gl.enableVertexAttribArray(slotName);
        gl.vertexAttribPointer(slotName, 3, gl.FLOAT, false, 0, 0);
      }
      return true;
    } else if (slotBinderValue == Mesh.BINDER_COORDINATE) {
      if (this.mCoordBuffer != null) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mCoordBuffer);
        gl.enableVertexAttribArray(slotName);
        gl.vertexAttribPointer(slotName, 2, gl.FLOAT, false, 0, 0);
      }
      return true;
    } else if (slotBinderValue == Mesh.BINDER_VERTEXCOLOR) {
      if (this.mVertexColorBuffer != null) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mVertexColorBuffer);
        gl.enableVertexAttribArray(slotName);
        gl.vertexAttribPointer(slotName, 4, gl.FLOAT, false, 0, 0);
      }
      return true;
    } else {
      console.error("[Mesh] Binding '" + slotName + "' ...failed");
      return false;
    }
  }

  destory(gl) {
    if (this.mVertexBuffer != null) {
      gl.deleteBuffer(this.mVertexBuffer);
      this.mVertexBuffer = null;
    }
    if (this.mNormalBuffer != null) {
      gl.deleteBuffer(this.mNormalBuffer);
      this.mNormalBuffer = null;
    }
    if (this.mCoordBuffer != null) {
      gl.deleteBuffer(this.mCoordBuffer);
      this.mCoordBuffer = null;
    }
    if (this.mVertexColorBuffer != null) {
      gl.deleteBuffer(this.mVertexColorBuffer);
      this.mVertexColorBuffer = null;
    }
  }

  getBinder(gl, binder) {
    for (let i = 0; i < this.mBinderMap.length; i++) {
      if (binder == this.mBinderMap[i].key) {
        return this.mBinderMap[i].value;
      }
    }
    return null;
  }
}

Mesh.MODE_POINTS         = "POINTS";
Mesh.MODE_LINES          = "LINES";
Mesh.MODE_LINE_LOOP      = "LINE_LOOP";
Mesh.MODE_LINE_STRIP     = "LINE_STRIP";
Mesh.MODE_TRIANGLES      = "TRIANGLES";
Mesh.MODE_TRIANGLE_STRIP = "TRIANGLE_STRIP";
Mesh.MODE_TRIANGLE_FAN   = "TRIANGLE_FAN";
Mesh.BINDER_VERTEX       = "mVertexes";
Mesh.BINDER_NORMAL       = "mNormals";
Mesh.BINDER_COORDINATE   = "mCoordinates";
Mesh.BINDER_VERTEXCOLOR  = "mVertexColors";
