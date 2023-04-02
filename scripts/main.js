const interval = 5; // Sampling period
const period = 15000; // Period of cube's rotation
let time = 0; // Current time

const white = "#ffffffff";
const black = "#000000";
const creamWhite = "#FCFBF4EE";
const green = "#11FF3499"
const red = "#FF3333BB";
const blue = "#0034FFBB";
const orange = "#FF8C00EE";
const yellow = "#FFFF00EE";

let colors = [green, red, blue, orange];

function main() {
    //ipStackQuery();
    draw();
}

function ipStackQuery() {
    /*
    function reqListener() {
        console.log(this.responseText);
    }
    */

    let oReq = new XMLHttpRequest();
    /*
    oReq.onLoad = function() {
        console.log(this.responseText);
    }
    */

    oReq.open("get", "../index.php", true);
    oReq.send();
}

function draw() {
    //setInterval(drawTransparentCube, interval);
    setInterval(drawSolvedRubiksCube, interval, 2);
    setInterval(drawSolvedRubiksCube, interval, 3);
    setInterval(drawSolvedRubiksCube, interval, 4);
    setInterval(drawSolvedRubiksCube, interval, 7);
    setInterval(drawPyraminx, interval);
}

function drawTransparentCube() {
    let canvas = document.getElementById("transparentCanvas");
    let ctx = canvas.getContext("2d");
    let numSides = 4;
    let dim = 5;

    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Retrieve coordinates of all 8 corners of the cube
    let cornerCoords = cornerCoordinates(canvas.width, canvas.height, numSides);
    let topX = cornerCoords[0];
    let topY = cornerCoords[1];
    let bottomX = cornerCoords[2];
    let bottomY = cornerCoords[3];

    // Retrieve coordinates of 2 inner points on each of the edge line segments
    let innerCoords = innerCoordinates(
        canvas.width,
        canvas.height,
        topX,
        topY,
        bottomX,
        bottomY,
        numSides,
        dim
    );
    let topInnerX = innerCoords[0];
    let topInnerY = innerCoords[1];
    let midInnerX = innerCoords[2];
    let midInnerY = innerCoords[3];
    let bottomInnerX = innerCoords[4];
    let bottomInnerY = innerCoords[5];

    // Fill front, left, back, and side faces of the cube with same color
    const fillColor = "#9A9A9A";
    for (let i = 0; i < numSides; i++) {
        let j = (i + 1) % numSides;
        fillSide(ctx, i, j, topX, topY, bottomX, bottomY, fillColor);
    }

    drawInnerTopLines(ctx, topInnerX, topInnerY, numSides, dim);
    drawInnerBottomLines(ctx, bottomInnerX, bottomInnerY, numSides, dim);
    let indices = [];
    for (let i = 0; i < (dim - 1) * numSides; i++) {
        indices.push(i);
    }
    drawInnerVerticalLines(ctx, topInnerX, topInnerY, bottomInnerX, bottomInnerY, indices);
    drawInnerHorizontalLines(ctx, midInnerX, midInnerY, numSides, dim);

    // Draw all 8 edges of the cube with a solid black line
    drawEdges(ctx, topX, topY, bottomX, bottomY, numSides);
    
    time += interval;
}

function drawSolvedRubiksCube(dim) {

    const transparent = false;
    let numSides = 4;
    colorsCurr = colors.slice(dim % numSides).concat(colors.slice(0, dim % numSides));

    let canvas = document.getElementById(dim + "x" + dim + "rubiksCanvas");
    let ctx = canvas.getContext("2d");
    ctx.strokeStyle = black;

    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Retrieve coordinates of all 8 corners of the cube
    let cornerCoords = cornerCoordinates(canvas.width, canvas.height, numSides);
    let topX = cornerCoords[0];
    let topY = cornerCoords[1];
    let bottomX = cornerCoords[2];
    let bottomY = cornerCoords[3];

    // Retrieve coordinates of 2 inner points on each of the edge line segments
    let innerCoords = innerCoordinates(
        canvas.width,
        canvas.height,
        topX,
        topY,
        bottomX,
        bottomY,
        numSides,
        dim
    );
    let topInnerX = innerCoords[0];
    let topInnerY = innerCoords[1];
    let midInnerX = innerCoords[2];
    let midInnerY = innerCoords[3];
    let bottomInnerX = innerCoords[4];
    let bottomInnerY = innerCoords[5];

    let timeModified = Math.max(0, time - period / 8);
    let quad = Math.ceil(
        (timeModified / period - Math.floor(timeModified / period)) * numSides
    );
    let currIndex = mod(numSides - quad, numSides);

    let prevIndex = mod(currIndex - 1, numSides);
    let nextIndex = mod(currIndex + 1, numSides);

    fillSide(ctx, currIndex, prevIndex, topX, topY, bottomX, bottomY, colorsCurr[currIndex]);
    fillSide(ctx, currIndex, nextIndex, topX, topY, bottomX, bottomY, colorsCurr[nextIndex]);

    // Draw edges of bottom layer of cube (line segments connecting top four corner points)
    drawBottomEdges(ctx, bottomX, bottomY, transparent, currIndex, numSides);

    // Draw edges of top layer of cube (line segments connecting top four corner points)
    drawTopEdges(ctx, topX, topY, numSides);
    fill(ctx, topX, topY, creamWhite, numSides);

    drawVerticalEdges(ctx, topX, topY, bottomX, bottomY, transparent, currIndex, numSides);

    let indices = [];
    for (let i = 0; i < dim - 1; i++) {
        indices.push(prevIndex * (dim - 1) + i);
    }
    for (let i = 0; i < dim - 1; i++) {
        indices.push(currIndex * (dim - 1) + i);
    }
    drawInnerVerticalLines(ctx, topInnerX, topInnerY, bottomInnerX, bottomInnerY, indices);

    // Draw horizontal inner lines
    ctx.beginPath();
    for (let i = 0; i < dim - 1; i++) {
        ctx.moveTo(midInnerX[prevIndex * (dim - 1) + i], midInnerY[prevIndex * (dim - 1) + i]);
        ctx.lineTo(midInnerX[currIndex * (dim - 1) + i], midInnerY[currIndex * (dim - 1) + i]);
        ctx.lineTo(midInnerX[nextIndex * (dim - 1) + i], midInnerY[nextIndex * (dim - 1) + i]);
    }
    ctx.stroke();

    drawInnerTopLines(ctx, topInnerX, topInnerY, numSides, dim);

    time += interval;
}

function drawPyraminx() {
    const transparent = false;
    let numSides = 3;
    let dim = 3;

    let canvas = document.getElementById("pyraminxCanvas");
    let ctx = canvas.getContext("2d");
    ctx.strokeStyle = black;

    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Retrieve coordinates of all corners
    let cornerCoords = cornerCoordinates(canvas.width, canvas.height, numSides);
    let bottomX = cornerCoords[2];
    let bottomY = cornerCoords[3];
    let topX = [canvas.width / 2, canvas.width / 2, canvas.width / 2, canvas.width / 2];
    let topY = [0, 0, 0, 0];

    // Retrieve coordinates of 2 inner points on each of the edge line segments
    let innerCoords = innerCoordinates(
        canvas.width,
        canvas.height,
        topX,
        topY,
        bottomX,
        bottomY,
        numSides,
        dim
    );

    let midInnerX = innerCoords[2];
    let midInnerY = innerCoords[3];
    let bottomInnerX = innerCoords[4];
    let bottomInnerY = innerCoords[5];


    let timeModified = Math.max(0, time - period / 8);
    let triad = Math.ceil(
        (timeModified / period - Math.floor(timeModified / period)) * numSides
    );
    let currIndex = mod(numSides - triad, numSides);

    let colors = [yellow, red, blue];

    let prevIndex = mod(currIndex - 1, numSides);
    let nextIndex = mod(currIndex + 1, numSides);

    if (bottomX[prevIndex] > bottomX[currIndex]) {
        fillSide(ctx, currIndex, prevIndex, topX, topY, bottomX, bottomY, colors[currIndex]);
    }
    if (bottomX[nextIndex] < bottomX[currIndex]) {
        fillSide(ctx, currIndex, nextIndex, topX, topY, bottomX, bottomY, colors[nextIndex]);
    }

    drawVerticalEdges(ctx, topX, topY, bottomX, bottomY, transparent, currIndex, numSides);

    // Draw edges of bottom layer (line segments connecting bottom corner points)
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
            ctx.lineTo(bottomInnerX[currIndex * 2 + i], bottomInnerY[currIndex * 2 + i]);
            ctx.lineTo(midInnerX[currIndex * 2 + (1-i)], midInnerY[currIndex * 2 + (1-i)]);
        }

        if (bottomX[prevIndex] > bottomX[currIndex]) {
            ctx.moveTo(midInnerX[currIndex * 2 + (1-i)], midInnerY[currIndex * 2 + (1-i)]);
            ctx.lineTo(bottomInnerX[prevIndex * 2 + (1-i)], bottomInnerY[prevIndex * 2 + (1-i)]);
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

    time += interval;
}

main();
