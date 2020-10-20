const interval = 5; // Sampling period
const period = 5000; // Period of cube's rotation
var time = 0; // Current time

function draw() {
    setInterval(drawTransparentCube, interval);
    setInterval(drawRubiksCube, interval);
}

function drawTransparentCube() {
    var canvas = document.getElementById("transparentCanvas");
    var ctx = canvas.getContext("2d");

    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // (x, y) coordinates of the top layer of cube
    var cornerCoords = cornerCoordinates(canvas.width, canvas.height);
    var topX = cornerCoords[0];
    var topY = cornerCoords[1];
    var bottomX = cornerCoords[2];
    var bottomY = cornerCoords[3];

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

    // Fill all faces of the cube
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

function drawRubiksCube() {
    //console.log("time " + time);

    var canvas = document.getElementById("rubiksCanvas");
    var ctx = canvas.getContext("2d");

    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // (x, y) coordinates of the top layer of cube
    var topX = [];
    var topY = [];

    // (x, y) coordinates of the bottom layer of cube
    var bottomX = [];
    var bottomY = [];

    // Compute (x, y) coordinates of four corners of top layer and bottom layer
    for (let i = 0; i < 4; i++) {
        bottomX[i] =
            -150 * Math.sin(2 * Math.PI * (time / period + i / 4)) + 150;
        bottomY[i] = 75 * Math.cos(2 * Math.PI * (time / period + i / 4)) + 250;

        topX[i] = -150 * Math.sin(2 * Math.PI * (time / period + i / 4)) + 150;
        topY[i] = 75 * Math.cos(2 * Math.PI * (time / period + i / 4)) + 75;
    }

    // Compute inner points of bottom face edges
    var bottomInnerX = [];
    var bottomInnerY = [];
    for (let i = 0; i < 4; i++) {
        var j = (i + 1) % 4;

        bottomInnerX[i * 2] = bottomX[i] + (bottomX[j] - bottomX[i]) / 3;
        bottomInnerX[i * 2 + 1] =
            bottomX[i] + (2 * (bottomX[j] - bottomX[i])) / 3;

        bottomInnerY[i * 2] = bottomY[i] + (bottomY[j] - bottomY[i]) / 3;
        bottomInnerY[i * 2 + 1] =
            bottomY[i] + (2 * (bottomY[j] - bottomY[i])) / 3;
    }

    // Compute inner points of top face edges
    var topInnerX = [];
    var topInnerY = [];
    for (let i = 0; i < 4; i++) {
        var j = (i + 1) % 4;

        topInnerX[i * 2] = topX[i] + (topX[j] - topX[i]) / 3;
        topInnerX[i * 2 + 1] = topX[i] + (2 * (topX[j] - topX[i])) / 3;

        topInnerY[i * 2] = topY[i] + (topY[j] - topY[i]) / 3;
        topInnerY[i * 2 + 1] = topY[i] + (2 * (topY[j] - topY[i])) / 3;
    }

    var midInnerX = [];
    var midInnerY = [];
    for (let i = 0; i < 4; i++) {
        midInnerX[i * 2] = topX[i];
        midInnerX[i * 2 + 1] = topX[i];

        midInnerY[i * 2] = topY[i] + (bottomY[i] - topY[i]) / 3;
        midInnerY[i * 2 + 1] = topY[i] + (2 * (bottomY[i] - topY[i])) / 3;
    }

    var timeModified = Math.max(0, time - period / 8);
    var quad = Math.ceil(
        (timeModified / period - Math.floor(timeModified / period)) * 4
    );
    var curr = mod(4 - quad, 4);

    var colors = ["#11FF34", "#EEEEEE", "#0034FF", "#FFFF00"];

    //if (curr == 0) {
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
