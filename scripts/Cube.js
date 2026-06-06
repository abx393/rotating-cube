/**
 * RotatingCube class - Encapsulates cube animation state and rendering
 * Each instance maintains its own time, period, and colors
 */
class RotatingCube {
  /**
   * @param {string} canvasId - ID of canvas element to render on
   * @param {number} numSides - Number of sides (4 for cube, 3 for pyramid)
   * @param {number} dim - Dimension of cube (2, 3, 4, 7, etc.)
   * @param {number} period - Duration of one full rotation in milliseconds (default: from CONFIG)
   * @param {number} interval - Redraw interval in milliseconds (default: from CONFIG)
   */
  constructor(canvasId, numSides, dim, period = CONFIG.animation.period, interval = CONFIG.animation.interval) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas with id "${canvasId}" not found`);
      return;
    }

    this.ctx = this.canvas.getContext("2d");
    this.numSides = numSides;
    this.dim = dim;
    this.period = period;
    this.interval = interval;
    this.time = 0;
    this.intervalId = null;
    this.isRunning = false;

    // Color constants from global CONFIG
    this.white = CONFIG.colors.white;
    this.black = CONFIG.colors.black;
    this.creamWhite = CONFIG.colors.creamWhite;
    this.green = CONFIG.colors.green;
    this.red = CONFIG.colors.red;
    this.blue = CONFIG.colors.blue;
    this.orange = CONFIG.colors.orange;
    this.yellow = CONFIG.colors.yellow;

    this.colors = [this.green, this.red, this.blue, this.orange];
  }

  /**
   * Start the animation loop
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalId = setInterval(() => this.draw(), this.interval);
  }

  /**
   * Stop the animation loop
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  /**
   * Reset animation to start
   */
  reset() {
    this.time = 0;
    this.draw();
  }

  /**
   * Main draw function - to be overridden by subclasses
   */
  draw() {
    // Override in subclasses
  }

  /**
   * Utility: modulus function for negative x
   */
  mod(x, y) {
    return mod(x, y);
  }

  /**
   * Update time state
   */
  updateTime() {
    this.time += this.interval;
  }
}

/**
 * RubiksCube class - Renders Rubik's cubes of various dimensions
 */
class RubiksCube extends RotatingCube {
  constructor(canvasId, dim, period = CONFIG.animation.period, interval = CONFIG.animation.interval) {
    super(canvasId, 4, dim, period, interval);
  }

  draw() {
    const transparent = false;
    let colorsCurr = this.colors
      .slice(this.dim % this.numSides)
      .concat(this.colors.slice(0, this.dim % this.numSides));

    this.ctx.strokeStyle = this.black;
    this.ctx.lineWidth = CONFIG.canvas.lineWidth;

    // Reset canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Retrieve coordinates of all 8 corners of the cube
    const { topX, topY, bottomX, bottomY } = cornerCoordinates(
      this.canvas.width,
      this.canvas.height,
      this.numSides,
      this.time,
      this.period
    );

    // Retrieve coordinates of inner points on each edge
    let innerCoords = innerCoordinates(
      this.canvas.width,
      this.canvas.height,
      topX,
      topY,
      bottomX,
      bottomY,
      this.numSides,
      this.dim
    );
    let topInnerX = innerCoords[0];
    let topInnerY = innerCoords[1];
    let midInnerX = innerCoords[2];
    let midInnerY = innerCoords[3];
    let bottomInnerX = innerCoords[4];
    let bottomInnerY = innerCoords[5];

    let timeModified = Math.max(0, this.time - this.period / 8);
    let quad = Math.ceil(
      (timeModified / this.period -
        Math.floor(timeModified / this.period)) *
        this.numSides
    );
    let currIndex = this.mod(this.numSides - quad, this.numSides);

    let prevIndex = this.mod(currIndex - 1, this.numSides);
    let nextIndex = this.mod(currIndex + 1, this.numSides);

    fillSide(
      this.ctx,
      currIndex,
      prevIndex,
      topX,
      topY,
      bottomX,
      bottomY,
      colorsCurr[currIndex]
    );
    fillSide(
      this.ctx,
      currIndex,
      nextIndex,
      topX,
      topY,
      bottomX,
      bottomY,
      colorsCurr[nextIndex]
    );

    // Draw edges of bottom layer
    drawBottomEdges(
      this.ctx,
      bottomX,
      bottomY,
      transparent,
      currIndex,
      this.numSides
    );

    // Draw edges of top layer
    drawTopEdges(this.ctx, topX, topY, this.numSides);
    fill(this.ctx, topX, topY, this.creamWhite, this.numSides);

    drawVerticalEdges(
      this.ctx,
      topX,
      topY,
      bottomX,
      bottomY,
      transparent,
      currIndex,
      this.numSides
    );

    let indices = [];
    for (let i = 0; i < this.dim - 1; i++) {
      indices.push(prevIndex * (this.dim - 1) + i);
    }
    for (let i = 0; i < this.dim - 1; i++) {
      indices.push(currIndex * (this.dim - 1) + i);
    }
    drawInnerVerticalLines(
      this.ctx,
      topInnerX,
      topInnerY,
      bottomInnerX,
      bottomInnerY,
      indices
    );

    // Draw horizontal inner lines
    this.ctx.beginPath();
    for (let i = 0; i < this.dim - 1; i++) {
      this.ctx.moveTo(
        midInnerX[prevIndex * (this.dim - 1) + i],
        midInnerY[prevIndex * (this.dim - 1) + i]
      );
      this.ctx.lineTo(
        midInnerX[currIndex * (this.dim - 1) + i],
        midInnerY[currIndex * (this.dim - 1) + i]
      );
      this.ctx.lineTo(
        midInnerX[nextIndex * (this.dim - 1) + i],
        midInnerY[nextIndex * (this.dim - 1) + i]
      );
    }
    this.ctx.stroke();

    drawInnerTopLines(this.ctx, topInnerX, topInnerY, this.numSides, this.dim);

    this.updateTime();
  }
}

/**
 * Pyraminx class - Renders triangular pyramid
 */
class Pyraminx extends RotatingCube {
  constructor(canvasId, period = CONFIG.animation.period, interval = CONFIG.animation.interval) {
    super(canvasId, 3, 3, period, interval);
  }

  draw() {
    const transparent = false;

    let canvas = this.canvas;
    let ctx = this.ctx;
    ctx.strokeStyle = this.black;
    ctx.lineWidth = CONFIG.canvas.lineWidth;

    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Retrieve corner coordinates
    const { topX, topY, bottomX, bottomY } = cornerCoordinates(
      canvas.width,
      canvas.height,
      this.numSides,
      this.time,
      this.period
    );
    // Pyraminx apex: all top vertices converge to a single peak
    for (let i = 0; i < topX.length; i++) {
      topX[i] = canvas.width / 2;
      topY[i] = 0;
    }

    // Retrieve inner coordinates
    let innerCoords = innerCoordinates(
      canvas.width,
      canvas.height,
      topX,
      topY,
      bottomX,
      bottomY,
      this.numSides,
      this.dim
    );

    let midInnerX = innerCoords[2];
    let midInnerY = innerCoords[3];
    let bottomInnerX = innerCoords[4];
    let bottomInnerY = innerCoords[5];

    let timeModified = Math.max(0, this.time - this.period / 8);
    let triad = Math.ceil(
      ((timeModified / this.period -
        Math.floor(timeModified / this.period)) *
        this.numSides)
    );
    let currIndex = this.mod(this.numSides - triad, this.numSides);

    let colors = [this.yellow, this.red, this.blue];

    let prevIndex = this.mod(currIndex - 1, this.numSides);
    let nextIndex = this.mod(currIndex + 1, this.numSides);

    if (bottomX[prevIndex] > bottomX[currIndex]) {
      fillSide(
        ctx,
        currIndex,
        prevIndex,
        topX,
        topY,
        bottomX,
        bottomY,
        colors[currIndex]
      );
    }
    if (bottomX[nextIndex] < bottomX[currIndex]) {
      fillSide(
        ctx,
        currIndex,
        nextIndex,
        topX,
        topY,
        bottomX,
        bottomY,
        colors[nextIndex]
      );
    }

    drawVerticalEdges(
      ctx,
      topX,
      topY,
      bottomX,
      bottomY,
      transparent,
      currIndex,
      this.numSides
    );

    // Draw edges of bottom layer
    ctx.beginPath();
    if (bottomX[nextIndex] < bottomX[currIndex]) {
      ctx.moveTo(bottomX[nextIndex], bottomY[nextIndex]);
      ctx.lineTo(bottomX[currIndex], bottomY[currIndex]);
    }
    if (bottomX[prevIndex] > bottomX[currIndex]) {
      ctx.moveTo(bottomX[currIndex], bottomY[currIndex]);
      ctx.lineTo(bottomX[prevIndex], bottomY[prevIndex]);
    }
    ctx.stroke();

    // Draw inner diagonal lines
    ctx.beginPath();
    for (let i = 0; i < 2; i++) {
      if (bottomX[nextIndex] < bottomX[currIndex]) {
        ctx.moveTo(midInnerX[nextIndex * 2 + i], midInnerY[nextIndex * 2 + i]);
        ctx.lineTo(
          bottomInnerX[currIndex * 2 + i],
          bottomInnerY[currIndex * 2 + i]
        );
        ctx.lineTo(
          midInnerX[currIndex * 2 + (1 - i)],
          midInnerY[currIndex * 2 + (1 - i)]
        );
      }

      if (bottomX[prevIndex] > bottomX[currIndex]) {
        ctx.moveTo(
          midInnerX[currIndex * 2 + (1 - i)],
          midInnerY[currIndex * 2 + (1 - i)]
        );
        ctx.lineTo(
          bottomInnerX[prevIndex * 2 + (1 - i)],
          bottomInnerY[prevIndex * 2 + (1 - i)]
        );
        ctx.lineTo(midInnerX[prevIndex * 2 + i], midInnerY[prevIndex * 2 + i]);
      }
    }
    ctx.stroke();

    // Draw inner horizontal lines
    ctx.beginPath();
    for (let i = 0; i < 2; i++) {
      if (bottomX[nextIndex] < bottomX[currIndex]) {
        ctx.moveTo(midInnerX[nextIndex * 2 + i], midInnerY[nextIndex * 2 + i]);
        ctx.lineTo(midInnerX[currIndex * 2 + i], midInnerY[currIndex * 2 + i]);
      }
      if (bottomX[prevIndex] > bottomX[currIndex]) {
        ctx.moveTo(midInnerX[currIndex * 2 + i], midInnerY[currIndex * 2 + i]);
        ctx.lineTo(midInnerX[prevIndex * 2 + i], midInnerY[prevIndex * 2 + i]);
      }
    }
    ctx.stroke();

    this.updateTime();
  }
}
