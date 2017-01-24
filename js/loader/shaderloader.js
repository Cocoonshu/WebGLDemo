'use strict'

class ShaderLoader {

  /**
   * Load shader program pieces from the model json or the mProgram node of the model json
   * @json
   */
  static loadFromJSON(json) {
    if (json == null) {
      return null;
    } else if (json instanceof Array) {
      // The json should be one shader program node of model json
      console.error("[ShaderLoader] The json should be one shader program node of model json");
      return null;
    }

    let program              = json.mPrograms == null ? json : null;
    let vertexShaderSource   = program == null ? null : program.mVertexShader;
    let fragmentShaderSource = program == null ? null : program.mFragmentShader;
    let argumentsArray       = program == null ? null : program.mExportArguments;

    if (program.mName == null || program.mName == "") {
      // The shader program must has a name as its identify
      console.error("[ShaderLoader] The shader program must has a name as its identify");
      return null;
    }
    if ((vertexShaderSource != null || fragmentShaderSource != null) && argumentsArray != null) {
      // Export arguments
      for (let i = 0; i < argumentsArray.length; i++) {
        let type   = argumentsArray[i].mType;
        let name   = argumentsArray[i].mName;
        let binder = argumentsArray[i].mBinder;
        if (name == null || name == "") {
          // The shader program 'name' has empty exported argument
          console.error("[ShaderLoader] The shader program '" + program.mName + "' has empty exported argument");
          return null;
        }
        if (!ShaderLoader.isValidShaderType(type)) {
          // Illegal Type, the type of argument 'name' is 'type'
          console.error("[ShaderLoader] Illegal Type, the type of argument '" + name + "' is '" + type + "'");
          continue;
        }
        if (binder == null || name == "") {
          // The binder of argument 'name' is empty, it cannot be assigned
          console.error("[ShaderLoader] The binder of argument '" + name + "' is empty, it cannot be assigned");
          return null;
        }

        // Search argument in source
        let reg = new RegExp(name);
        if (reg.test(vertexShaderSource)) {
          continue;
        } else if (reg.test(fragmentShaderSource)) {
          continue;
        } else {
          // The argument 'name' cannot be found in shader source
          console.error("[ShaderLoader] The argument '" + name + "' isn't found in shader source");
          return null;
        }
      }

      // Generate program instance
      let shader = new Shader(program.mName);
      shader.setVertexShaderSource(vertexShaderSource);
      shader.setFragmentShaderSource(fragmentShaderSource);
      shader.setExportArguments(argumentsArray);
      return shader;
    } else {
      // The shader must has at least one shader source
      console.error("[ShaderLoader] The shader must has at least one shader source");
      return null;
    }
  } // #end loadFromJSON(json)

  /**
   * # No Use
   * Install shader program pieces as a valid shader instance
   * @program
   * @meshArray
   * @materialArray
   */
  static installShaderProgram(program, meshArray, materialArray) {
    if (program == null) {
      // The shader program is null, cannot install it
      console.error("[ShaderLoader] The shader program is null, cannot install it");
      return false;
    } else if (meshArray == null || meshArray.length == 0) {
      // The mesh array is empty, cannot install shader program from it
      console.error("[ShaderLoader] The mesh array is null, cannot install shader program from it");
      return false;
    } else {
      // The material array could be empty
      if (program.mExportArguments == null || program.mExportArguments.length == 0) {
        return true;
      } else {

      }
    }

    return true;
  } // #end installShaderProgram(meshArray, materialArray)

  /**
   * Whether the type of shoder argument is valid
   * @type shader argument type
   */
  static isValidShaderType(type) {
    return type == Shader.TYPE_UNIFORM || type == Shader.TYPE_ATTRIB || type == Shader.TYPE_VARYING;
  }
}
