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

    // Fill all faces of the cube with same color
    const fillColor = "#8a3b2c";
    fillBottom(ctx, bottomX, bottomY, fillColor);
    fillTop(ctx, topX, topY, fillColor);
    fillLeft(ctx, topX, topY, bottomX, bottomY, fillColor);
    fillRight(ctx, topX, topY, bottomX, bottomY, fillColor);
    fillFront(ctx, topX, topY, bottomX, bottomY, fillColor);
    fillBack(ctx, topX, topY, bottomX, bottomY, fillColor);
    
    drawInnerTopLines(ctx, topInnerX, topInnerY);
    drawInnerBottomLines(ctx, bottomInnerX, bottomInnerY);
    drawInnerVerticalLines(ctx, topInnerX, topInnerY, bottomInnerX, bottomInnerY);
    drawInnerHorizontalLines(ctx, midInnerX, midInnerY);

    // Draw all 8 edges of the cube with a solid black line
    drawVerticalEdges(ctx, topX, topY, bottomX, bottomY);
    drawTopEdges(ctx, topX, topY);
    drawBottomEdges(ctx, bottomX, bottomY);
    
    time += interval;
}

function drawSolvedRubiksCube() {
    var canvas = document.getElementById("rubiksCanvas");
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

    var timeModified = Math.max(0, time - period / 8);
    var quad = Math.ceil(
        (timeModified / period - Math.floor(timeModified / period)) * 4
    );
    var curr = mod(4 - quad, 4);

    var colors = ["#11FF34", "#EEEEEE", "#0034FF", "#FFFF00"];

    var prev = mod(curr - 1, 4);
    var next = mod(curr + 1, 4);

    ctx.beginPath();
    ctx.moveTo(topX[curr], topY[curr]);
    ctx.lineTo(topX[prev], topY[prev]);
    ctx.lineTo(bottomX[prev], bottomY[prev]);
    ctx.lineTo(bottomX[curr], bottomY[curr]);
    ctx.lineTo(topX[curr], topY[curr]);
    ctx.fillStyle = colors[curr];
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(topX[curr], topY[curr]);
    ctx.lineTo(topX[next], topY[next]);
    ctx.lineTo(bottomX[next], bottomY[next]);
    ctx.lineTo(bottomX[curr], bottomY[curr]);
    ctx.lineTo(topX[curr], topY[curr]);
    ctx.fillStyle = colors[next];
    ctx.fill();

    // Draw edges of bottom layer of cube (line segments connecting top four corner points)
    ctx.beginPath();
    ctx.moveTo(bottomX[prev], bottomY[prev]);
    ctx.lineTo(bottomX[curr], bottomY[curr]);
    ctx.lineTo(bottomX[next], bottomY[next]);
    ctx.stroke();

    // Draw edges of top layer of cube (line segments connecting top four corner points)
    ctx.beginPath();
    ctx.moveTo(topX[0], topY[0]);
    for (let i = 1; i < 4; i++) {
        ctx.lineTo(topX[i], topY[i]);
    }
    ctx.lineTo(topX[0], topY[0]);
    ctx.stroke();
    ctx.fillStyle = "#FF3333";
    ctx.fill();

    // Draw vertical edges
    for (let i = 0; i < 4; i++) {
        if (i != curr && i != prev && i != next) {
            continue;
        }
        ctx.beginPath();
        ctx.moveTo(topX[i], topY[i]);
        ctx.lineTo(bottomX[i], bottomY[i]);
        ctx.stroke();
    }

    // Draw vertical inner lines
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(topInnerX[curr * 2], topInnerY[curr * 2]);
    ctx.lineTo(bottomInnerX[curr * 2], bottomInnerY[curr * 2]);
    ctx.moveTo(topInnerX[curr * 2 + 1], topInnerY[curr * 2 + 1]);
    ctx.lineTo(bottomInnerX[curr * 2 + 1], bottomInnerY[curr * 2 + 1]);
    ctx.moveTo(topInnerX[prev * 2], topInnerY[prev * 2]);
    ctx.lineTo(bottomInnerX[prev * 2], bottomInnerY[prev * 2]);
    ctx.moveTo(topInnerX[prev * 2 + 1], topInnerY[prev * 2 + 1]);
    ctx.lineTo(bottomInnerX[prev * 2 + 1], bottomInnerY[prev * 2 + 1]);
    ctx.stroke();

    // Draw horizontal inner lines
    ctx.beginPath();
    for (let i = 0; i < 2; i++) {
        ctx.moveTo(midInnerX[prev * 2 + i], midInnerY[prev * 2 + i]);
        ctx.lineTo(midInnerX[curr * 2 + i], midInnerY[curr * 2 + i]);
        ctx.lineTo(midInnerX[next * 2 + i], midInnerY[next * 2 + i]);
    }
    ctx.stroke();

    // Draw inner lines of top face
    for (let i = 0; i < 4; i++) {
        //ctx.lineWidth = 3;
        ctx.beginPath();

        var curr = i * 2;
        var next = (i * 2 + 5) % 8;

        ctx.moveTo(topInnerX[curr], topInnerY[curr]);
        ctx.lineTo(topInnerX[next], topInnerY[next]);
        ctx.stroke();
    }

    time += interval;
}

function mod(x, y) {
    return (x + y) % y;
}

document.getElementById("drawBtn").addEventListener("click", draw);
