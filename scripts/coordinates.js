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
    for (let i = 0; i < numSides; i++) {
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
function innerCoordinates(width, height, topX, topY, bottomX, bottomY, numSides) {
    let topInnerX = [];
    let topInnerY = [];
    for (let i = 0; i < numSides; i++) {
        let j = (i + 1) % numSides;
        
        topInnerX[i * 2] = topX[i] + (topX[j] - topX[i]) / 3;
        topInnerX[i * 2 + 1] = topX[i] + 2 * (topX[j] - topX[i]) / 3;
        
        topInnerY[i * 2] = topY[i] + (topY[j] - topY[i]) / 3;
        topInnerY[i * 2 + 1] = topY[i] + 2 * (topY[j] - topY[i]) / 3;
    }
    
    let midInnerX = [];
    let midInnerY = [];
    for (let i = 0; i < numSides; i++) {
        midInnerX[i * 2] = topX[i] + (bottomX[i] - topX[i]) / 3;
        midInnerX[i * 2 + 1] = topX[i] + 2 * (bottomX[i] - topX[i]) / 3;
        
        midInnerY[i * 2] = topY[i] + (bottomY[i] - topY[i]) / 3;
        midInnerY[i * 2 + 1] = topY[i] + 2 * (bottomY[i] - topY[i]) / 3;
    }
    
    let bottomInnerX = [];
    let bottomInnerY = [];
    for (let i = 0; i < numSides; i++) {
        let j = (i + 1) % numSides;
        
        bottomInnerX[i * 2] = bottomX[i] + (bottomX[j] - bottomX[i]) / 3;
        bottomInnerX[i * 2 + 1] = bottomX[i] + 2 * (bottomX[j] - bottomX[i]) / 3;
        
        bottomInnerY[i * 2] = bottomY[i] + (bottomY[j] - bottomY[i]) / 3;
        bottomInnerY[i * 2 + 1] = bottomY[i] + 2 * (bottomY[j] - bottomY[i]) / 3;
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