'use strict'

class Plane extends Mesh {
  constructor(width, height) {
    super();

    this.mSize = {width, height};

    this.fillVertex([
      -0.5, -0.5, 0,
      +0.5, -0.5, 0,
      -0.5, +0.5, 0,
      +0.5, +0.5, 0
    ]);

    this.fillNormal([
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ]);

    this.fillCoordinates([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
    ]);

    this.fillVertexColors([
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0
    ]);

    this.fillIndices([
      0, 1, 2, 3
    ]);
  }

}
