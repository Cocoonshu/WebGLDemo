'use strict'

class ImagePlane extends Model {
  constructor() {
    super();

    this.addMesh(new Plane(1.0, 1.0));
  }
}
