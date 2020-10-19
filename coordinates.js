// Returns (x, y) coordinates of each of the 4 top and 4 bottom corners of the cube
function cornerCoordinates(width, height) {
    var topX = [];
    var topY = [];
    
    // (x, y) coordinates of the bottom layer of cube
    var bottomX = [];
    var bottomY = [];
    
    // Compute (x, y) coordinates of four corners of top layer and bottom layer
    for (let i = 0; i < 4; i++) {
        bottomX[i] = -150 * Math.sin(2 * Math.PI * (time / period + i / 4)) + 150; 
        bottomY[i] = 75 * Math.cos(2 * Math.PI * (time / period + i / 4)) + 250;
        
        topX[i] = -150 * Math.sin(2 * Math.PI * (time / period + i / 4)) + 150; 
        topY[i] = 75 * Math.cos(2 * Math.PI * (time / period + i / 4)) + 75;
    }
    
    var coords = [];
    coords.push(topX);
    coords.push(topY);
    coords.push(bottomX);
    coords.push(bottomY);
    return coords;
}

// Compute (x, y) coordinates of inner points of top, middle, and bottom layer
function innerCoordinates(width, height, topX, topY, bottomX, bottomY) {
    var topInnerX = [];
    var topInnerY = [];
    for (let i = 0; i < 4; i++) {
        var j = (i + 1) % 4;
        
        topInnerX[i * 2] = topX[i] + (topX[j] - topX[i]) / 3;
        topInnerX[i * 2 + 1] = topX[i] + 2 * (topX[j] - topX[i]) / 3;
        
        topInnerY[i * 2] = topY[i] + (topY[j] - topY[i]) / 3;
        topInnerY[i * 2 + 1] = topY[i] + 2 * (topY[j] - topY[i]) / 3;
    }
    
    var midInnerX = [];
    var midInnerY = [];
    for (let i = 0; i < 4; i++) {
        midInnerX[i * 2] = topX[i];
        midInnerX[i * 2 + 1] = topX[i];
        
        midInnerY[i * 2] = topY[i] + (bottomY[i] - topY[i]) / 3;
        midInnerY[i * 2 + 1] = topY[i] + 2 * (bottomY[i] - topY[i]) / 3;
    }
    
    var bottomInnerX = [];
    var bottomInnerY = [];
    for (let i = 0; i < 4; i++) {
        var j = (i + 1) % 4;
        
        bottomInnerX[i * 2] = bottomX[i] + (bottomX[j] - bottomX[i]) / 3;
        bottomInnerX[i * 2 + 1] = bottomX[i] + 2 * (bottomX[j] - bottomX[i]) / 3;
        
        bottomInnerY[i * 2] = bottomY[i] + (bottomY[j] - bottomY[i]) / 3;
        bottomInnerY[i * 2 + 1] = bottomY[i] + 2 * (bottomY[j] - bottomY[i]) / 3;
    }
    
    var coords = [];
    coords.push(topInnerX);
    coords.push(topInnerY);
    coords.push(midInnerX);
    coords.push(midInnerY);
    coords.push(bottomInnerX);
    coords.push(bottomInnerY);
    return coords;
}