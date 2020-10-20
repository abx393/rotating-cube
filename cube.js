const interval = 5; // Sampling period
const period = 5000; // Period of cube's rotation
var time = 0; // Current time

function draw() {
    setInterval(drawTransparentCube, interval);
    setInterval(drawSolvedRubiksCube, interval);
}

function drawTransparentCube() {
    var canvas = document.getElementById("transparentCanvas");
    var ctx = canvas.getContext("2d");

    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Retrieve coordinates of all 8 corners of the cube
    var cornerCoords = cornerCoordinates(canvas.width, canvas.height);
    var topX = cornerCoords[0];
    var topY = cornerCoords[1];
    var bottomX = cornerCoords[2];
    var bottomY = cornerCoords[3];

    // Retrieve coordinates of 2 inner points on each of the edge line segments
    var innerCoords = innerCoordinates(
        canvas.width,
        canvas.height,
        topX,
        topY,
        bottomX,
        bottomY
    );
    var topInnerX = innerCoords[0];
    var topInnerY = innerCoords[1];
    var midInnerX = innerCoords[2];
    var midInnerY = innerCoords[3];
    var bottomInnerX = innerCoords[4];
    var bottomInnerY = innerCoords[5];

    // Fill front, left, back, and side faces of the cube with same color
    const fillColor = "#8a3b2c";
    for (let i = 0; i < 4; i++) {
        var j = (i + 1) % 4;
        fillSide(ctx, i, j, topX, topY, bottomX, bottomY, fillColor);
    }
    
    drawInnerTopLines(ctx, topInnerX, topInnerY);
    drawInnerBottomLines(ctx, bottomInnerX, bottomInnerY);
    drawInnerVerticalLines(ctx, topInnerX, topInnerY, bottomInnerX, bottomInnerY);
    drawInnerHorizontalLines(ctx, midInnerX, midInnerY);

    // Draw all 8 edges of the cube with a solid black line
    drawEdges(ctx, topX, topY, bottomX, bottomY);
    
    time += interval;
}

function drawSolvedRubiksCube() {
    const transparent = false;
    
    var canvas = document.getElementById("rubiksCanvas");
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = 10;

    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Retrieve coordinates of all 8 corners of the cube
    var cornerCoords = cornerCoordinates(canvas.width, canvas.height);
    var topX = cornerCoords[0];
    var topY = cornerCoords[1];
    var bottomX = cornerCoords[2];
    var bottomY = cornerCoords[3];

    // Retrieve coordinates of 2 inner points on each of the edge line segments
    var innerCoords = innerCoordinates(
        canvas.width,
        canvas.height,
        topX,
        topY,
        bottomX,
        bottomY
    );
    var topInnerX = innerCoords[0];
    var topInnerY = innerCoords[1];
    var midInnerX = innerCoords[2];
    var midInnerY = innerCoords[3];
    var bottomInnerX = innerCoords[4];
    var bottomInnerY = innerCoords[5];

    var timeModified = Math.max(0, time - period / 8);
    var quad = Math.ceil(
        (timeModified / period - Math.floor(timeModified / period)) * 4
    );
    var currIndex = mod(4 - quad, 4);

    var colors = ["#11FF34", "#EEEEEE", "#0034FF", "#FFFF00"];

    var prevIndex = mod(currIndex - 1, 4);
    var nextIndex = mod(currIndex + 1, 4);

    fillSide(ctx, currIndex, prevIndex, topX, topY, bottomX, bottomY, colors[currIndex]);
    fillSide(ctx, currIndex, nextIndex, topX, topY, bottomX, bottomY, colors[nextIndex]);

    // Draw edges of bottom layer of cube (line segments connecting top four corner points)
    drawBottomEdges(ctx, bottomX, bottomY, transparent, currIndex);

    // Draw edges of top layer of cube (line segments connecting top four corner points)
    drawTopEdges(ctx, topX, topY);
    fillTop(ctx, topX, topY, "#FF3333");
    
    drawVerticalEdges(ctx, topX, topY, bottomX, bottomY, transparent, currIndex);

    //drawInnerVerticalLines(ctx, topInnerX, topInnerY, bottomInnerX, bottomInnerY, transparent, currIndex);
    
    // Draw vertical inner lines
    ctx.beginPath();
    ctx.moveTo(topInnerX[currIndex * 2], topInnerY[currIndex * 2]);
    ctx.lineTo(bottomInnerX[currIndex * 2], bottomInnerY[currIndex * 2]);
    ctx.moveTo(topInnerX[currIndex * 2 + 1], topInnerY[currIndex * 2 + 1]);
    ctx.lineTo(bottomInnerX[currIndex * 2 + 1], bottomInnerY[currIndex * 2 + 1]);
    ctx.moveTo(topInnerX[prevIndex * 2], topInnerY[prevIndex * 2]);
    ctx.lineTo(bottomInnerX[prevIndex * 2], bottomInnerY[prevIndex * 2]);
    ctx.moveTo(topInnerX[prevIndex * 2 + 1], topInnerY[prevIndex * 2 + 1]);
    ctx.lineTo(bottomInnerX[prevIndex * 2 + 1], bottomInnerY[prevIndex * 2 + 1]);
    ctx.stroke();

    // Draw horizontal inner lines
    ctx.beginPath();
    for (let i = 0; i < 2; i++) {
        ctx.moveTo(midInnerX[prevIndex * 2 + i], midInnerY[prevIndex * 2 + i]);
        ctx.lineTo(midInnerX[currIndex * 2 + i], midInnerY[currIndex * 2 + i]);
        ctx.lineTo(midInnerX[nextIndex * 2 + i], midInnerY[nextIndex * 2 + i]);
    }
    ctx.stroke();

    drawInnerTopLines(ctx, topInnerX, topInnerY);

    time += interval;
}

document.getElementById("drawBtn").addEventListener("click", draw);
