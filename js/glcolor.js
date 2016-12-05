module.exports =
class GLColor {
  constructor(intColor) {
    this.mIntColor = intColor;
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
    let transfer = (elem) => {

      return ;
    };

    return "#" + intAlpha.toString(16).toUpperCase();
  }

}
