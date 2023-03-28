// Returns (x, y) coordinates of each of the 4 top and 4 bottom corners of the cube
function cornerCoordinates(width, height, numSides) {
    let horizontalScale = width / 2;
    let verticalScale = height / 5;
    let verticalOffset = verticalScale;
    let topX = [];
    let topY = [];
    
    // (x, y) coordinates of the bottom layer of cube
    let bottomX = [];
    let bottomY = [];
    
    // Compute (x, y) coordinates of four corners of top layer and bottom layer
    for (let i = 0; i < 4; i++) {
        topX[i] = - horizontalScale * Math.sin(2 * Math.PI * (time / period + i / numSides)) + horizontalScale;
        topY[i] = verticalScale * Math.cos(2 * Math.PI * (time / period + i / numSides)) + verticalOffset;
        
        bottomX[i] = - horizontalScale * Math.sin(2 * Math.PI * (time / period + i / numSides)) + horizontalScale;
        bottomY[i] = verticalScale * Math.cos(2 * Math.PI * (time / period + i / numSides)) + (height - verticalOffset);
        
    }
    
    let coords = [];
    coords.push(topX);
    coords.push(topY);
    coords.push(bottomX);
    coords.push(bottomY);
    return coords;
}

// Compute (x, y) coordinates of inner points of top, middle, and bottom layer
function innerCoordinates(width, height, topX, topY, bottomX, bottomY, numSides, dim) {
    let topInnerX = [];
    let topInnerY = [];
    for (let i = 0; i < 4; i++) {
        let j = (i + 1) % 4;

        for (let k = 0; k < dim - 1; k++) {
            topInnerX[i * (dim - 1) + k] = topX[i] + (k+1) * (topX[j] - topX[i]) / dim;
            topInnerY[i * (dim - 1) + k] = topY[i] + (k+1) * (topY[j] - topY[i]) / dim;
        }
    }
    
    let midInnerX = [];
    let midInnerY = [];
    for (let i = 0; i < 4; i++) {
        for (let k = 0; k < dim - 1; k++) {
            midInnerX[i * (dim - 1) + k] = topX[i] + (k+1) * (bottomX[i] - topX[i]) / dim;
            midInnerY[i * (dim - 1) + k] = topY[i] + (k+1) * (bottomY[i] - topY[i]) / dim;
        }
    }
    
    let bottomInnerX = [];
    let bottomInnerY = [];
    for (let i = 0; i < 4; i++) {
        let j = (i + 1) % 4;
        for (let k = 0; k < dim - 1; k++) {
            bottomInnerX[i * (dim - 1) + k] = bottomX[i] + (k+1) * (bottomX[j] - bottomX[i]) / dim;
            bottomInnerY[i * (dim - 1) + k] = bottomY[i] + (k+1) * (bottomY[j] - bottomY[i]) / dim;
        }
    }
    
    let coords = [];
    coords.push(topInnerX);
    coords.push(topInnerY);
    coords.push(midInnerX);
    coords.push(midInnerY);
    coords.push(bottomInnerX);
    coords.push(bottomInnerY);
    return coords;
}