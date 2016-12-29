'use strict'

function GLColorTest() {
  console.log("color = #123 -> " + (new GLColor('#123').toHexColor()));
  console.log("color = #7ABC -> " + (new GLColor('#7ABC').toHexColor()));
  console.log("color = #FF1122 -> " + (new GLColor('#FF1122').toHexColor()));
  console.log("color = #33FF1122 -> " + (new GLColor('#33FF1122').toHexColor()));
  console.log("color = 0x44AAAACC -> " + (new GLColor(0x44AAAACC).toHexColor()));
  console.log("color = {0.9, 0.8, 0.5, 1.0} -> " + (new GLColor([0.9, 0.8, 0.5, 1.0]).toHexColor()));
}

//module.exports =
class GLColor {
  constructor(color) {
    if (typeof(color) == 'number') {
      this.mIntColor = color;
    } else if (typeof(color) == 'string') {
      this.fromHexColor(color);
    } else if (color instanceof Array && (color.length == 3 || color.length == 4)) {
      this.fromFloatArray(color);
    } else {
      throw "Wrong color format";
    }
  }

  getIntAlpha() {
    return (this.mIntColor >> 24) & 0xFF;
  }

  getFloatAlpha() {
    return this.getIntAlpha() / 255.0;
  }

  getIntRed() {
    return (this.mIntColor >> 16) & 0xFF;
  }

  getFloatRed() {
    return this.getIntRed() / 255.0;
  }

  getIntGreen() {
    return (this.mIntColor >> 8) & 0xFF;
  }

  getFloatGreen() {
    return this.getIntGreen() / 255.0;
  }

  getIntBlue() {
    return (this.mIntColor) & 0xFF;
  }

  getFloatBlue() {
    return this.getIntBlue() / 255.0;
  }

  setIntColor(alpha, red, green, blue) {
    this.mIntColor = ((alpha & 0xFF) << 24)
                   | ((red & 0xFF) << 16)
                   | ((green & 0xFF) << 8)
                   | (blue & 0xFF);
  }

  setFloatColor(alpha, red, green, blue) {
    this.setIntColor(alpha * 255, red * 255, green * 255, blue * 255);
  }

  toHexColor() {
    let intAlpha = this.getIntAlpha();
    let intRed   = this.getIntRed();
    let intGreen = this.getIntGreen();
    let intBlue  = this.getIntBlue();
    let transfer = function (elem) {
      let colorStr = elem.toString(16).toUpperCase();
      if (colorStr.length == 1) {
        return '0' + colorStr;
      } else {
        return colorStr;
      }
    };

    return "#" + transfer(intAlpha) + transfer(intRed) + transfer(intGreen) + transfer(intBlue);
  } // #end toHexColor()

  fromHexColor(hexColor) {
    if (typeof(hexColor) == 'string') {
      if (hexColor[0] == '#') {
        let intAlpha = 0;
        let intRed   = 0;
        let intGreen = 0;
        let intBlue  = 0;
        switch (hexColor.length) {
          case 4: {// #RGB
            let strRed   = hexColor.substring(1, 2);
            let strGreen = hexColor.substring(2, 3);
            let strBlue  = hexColor.substring(3, 4);

            intAlpha = 0xFF;
            intRed   = parseInt(strRed + strRed, 16);
            intGreen = parseInt(strGreen + strGreen, 16);
            intBlue  = parseInt(strBlue + strBlue, 16);
            intRed   = isNaN(intRed) ? 0x00 : intRed;
            intGreen = isNaN(intGreen) ? 0x00 : intGreen;
            intBlue  = isNaN(intBlue) ? 0x00 : intBlue;
          } break;

          case 5: {// #ARGB
            let strAlpha = hexColor.substring(1, 2);
            let strRed   = hexColor.substring(2, 3);
            let strGreen = hexColor.substring(3, 4);
            let strBlue  = hexColor.substring(4, 5);

            intAlpha = parseInt(strAlpha + strAlpha, 16);
            intRed   = parseInt(strRed + strRed, 16);
            intGreen = parseInt(strGreen + strGreen, 16);
            intBlue  = parseInt(strBlue + strBlue, 16);
            intAlpha = isNaN(intAlpha) ? 0xFF : intAlpha;
            intRed   = isNaN(intRed) ? 0x00 : intRed;
            intGreen = isNaN(intGreen) ? 0x00 : intGreen;
            intBlue  = isNaN(intBlue) ? 0x00 : intBlue;
          } break;

          case 7: {// #RRGGBB
            intAlpha = 0xFF;
            intRed   = parseInt(hexColor.substring(1, 3), 16);
            intGreen = parseInt(hexColor.substring(3, 5), 16);
            intBlue  = parseInt(hexColor.substring(5, 7), 16);
            intRed   = isNaN(intRed) ? 0x00 : intRed;
            intGreen = isNaN(intGreen) ? 0x00 : intGreen;
            intBlue  = isNaN(intBlue) ? 0x00 : intBlue;
          } break;

          case 9: {// #AARRGGBB
            intAlpha = parseInt(hexColor.substring(1, 3), 16);
            intRed   = parseInt(hexColor.substring(3, 5), 16);
            intGreen = parseInt(hexColor.substring(5, 7), 16);
            intBlue  = parseInt(hexColor.substring(7, 9), 16);
            intAlpha = isNaN(intAlpha) ? 0xFF : intAlpha;
            intRed   = isNaN(intRed) ? 0x00 : intRed;
            intGreen = isNaN(intGreen) ? 0x00 : intGreen;
            intBlue  = isNaN(intBlue) ? 0x00 : intBlue;
          } break;

          default: {
            throw "Wrong color format";
          } break;
        }

        this.setIntColor(intAlpha, intRed, intGreen, intBlue);
      }
    }
  } // #end fromHexColor(hexColor)

  fromFloatArray(color) {
    let length   = color.length;
    let intAlpha = 0;
    let intRed   = 0;
    let intGreen = 0;
    let intBlue  = 0;
    if (length == 3) {
      intAlpha = 255;
      intRed   = parseInt(color[0] * 255);
      intGreen = parseInt(color[1] * 255);
      intBlue  = parseInt(color[2] * 255);
    } else if (length == 4) {
      intRed   = parseInt(color[0] * 255);
      intGreen = parseInt(color[1] * 255);
      intBlue  = parseInt(color[2] * 255);
      intAlpha = parseInt(color[3] * 255);
    } else {
      throw "Wrong color format";
    }

    this.setIntColor(intAlpha, intRed, intGreen, intBlue);
  } // #end fromFloatArray(color)

  toFloatArray() {
    return [
      this.getFloatRed(),
      this.getFloatGreen(),
      this.getFloatBlue(),
      this.getFloatAlpha()
    ];
  }
}
