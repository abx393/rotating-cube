// Given Canvas.Context object, traces and fills the top edge of the cube
function fill(ctx, topX, topY, fillColor, numSides) {
    ctx.beginPath();
    ctx.moveTo(topX[0], topY[0]);
    
    for (let i = 1; i < numSides; i++) {
        ctx.lineTo(topX[i], topY[i]);
    }
    ctx.fillStyle = fillColor;
    ctx.fill();
}

// Trace and fill front, left, right, or back face of cube
function fillSide(ctx, from, to, topX, topY, bottomX, bottomY, fillColor) {
    ctx.beginPath();
    ctx.moveTo(topX[from], topY[from]);
    ctx.lineTo(topX[to], topY[to]);
    ctx.lineTo(bottomX[to], bottomY[to]);
    ctx.lineTo(bottomX[from], bottomY[from]);
    ctx.fillStyle = fillColor;
    ctx.fill();
}

// Draw inner lines of top face
function drawInnerTopLines(ctx, topInnerX, topInnerY) {
    ctx.lineWidth = 5;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();

        let curr = i * 2;
        let next = (i * 2 + 5) % 8;

        ctx.moveTo(topInnerX[curr], topInnerY[curr]);
        ctx.lineTo(topInnerX[next], topInnerY[next]);
        //ctx.strokeStyle = "#000000";
        ctx.stroke();
    }
}
    
// Draw inner lines of bottom face
function drawInnerBottomLines(ctx, bottomInnerX, bottomInnerY) {
    ctx.lineWidth = 5;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();

        let curr = i * 2;
        let next = (i * 2 + 5) % 8;

        ctx.moveTo(bottomInnerX[curr], bottomInnerY[curr]);
        ctx.lineTo(bottomInnerX[next], bottomInnerY[next]);
        ctx.stroke();
    }
}

// Draw vertical inner lines
function drawInnerVerticalLines(ctx, topInnerX, topInnerY, bottomInnerX, bottomInnerY, indices) {
    ctx.lineWidth = 5;
    for (let i = 0; i < indices.length; i++) {
        let index = indices[i];
        ctx.beginPath();
        ctx.moveTo(topInnerX[index], topInnerY[index]);
        ctx.lineTo(bottomInnerX[index], bottomInnerY[index]);
        ctx.stroke();
    }
}

// Draw horizontal inner lines
function drawInnerHorizontalLines(ctx, midInnerX, midInnerY, numSides) {
    ctx.beginPath();
    for (let i = 0; i < numSides; i++) {
        let index = mod(i * 2 + 2, 2 * numSides);
        ctx.moveTo(midInnerX[i * 2], midInnerY[i * 2]);
        ctx.lineTo(midInnerX[index], midInnerY[index]);

        index = mod(index + 1, 2 * numSides);
        ctx.moveTo(midInnerX[i * 2 + 1], midInnerY[i * 2 + 1]);
        ctx.lineTo(midInnerX[index], midInnerY[index]);
    }
    ctx.stroke();
}

// Draw edges
function drawEdges(ctx, topX, topY, bottomX, bottomY, numSides) {
    drawTopEdges(ctx, topX, topY, numSides);
    drawBottomEdges(ctx, bottomX, bottomY, true, 0, numSides);
    drawVerticalEdges(ctx, topX, topY, bottomX, bottomY, true, 0, numSides);
}

// Draw top edges
function drawTopEdges(ctx, topX, topY, numSides) {
    ctx.lineWidth = 5;
    for (let i = 0; i < numSides; i++) {
        ctx.beginPath();
        ctx.moveTo(topX[i], topY[i]);
        ctx.lineTo(topX[(i + 1) % numSides], topY[(i + 1) % numSides]);
        ctx.stroke();
    }
}

// Draw bottom edges
function drawBottomEdges(ctx, bottomX, bottomY, transparent, index, numSides) {
    let i = mod(index - 1, numSides);
    let j = index;
    let k = mod(index + 1, numSides);
    let h = mod(index + 2, numSides);
    
    ctx.beginPath();
    ctx.moveTo(bottomX[i], bottomY[i]);
    ctx.lineTo(bottomX[j], bottomY[j]);
    ctx.lineTo(bottomX[k], bottomY[k]);
    
    if (transparent) {
        ctx.lineTo(bottomX[h], bottomY[h]);
        ctx.lineTo(bottomX[i], bottomY[i]);
    }
    ctx.stroke();
}

// Draw vertical edges
function drawVerticalEdges(ctx, topX, topY, bottomX, bottomY, transparent, index, numSides) {
    ctx.lineWidth = 5;
    let i = mod(index - 1, numSides);
    let j = index;
    let k = mod(index + 1, numSides);
    let h = mod(index + 2, numSides);

    if (bottomX[i] > bottomX[j]) {
        ctx.beginPath();
        ctx.moveTo(topX[i], topY[i]);
        ctx.lineTo(bottomX[i], bottomY[i]);
        ctx.stroke();
    }
    
    ctx.beginPath();
    ctx.moveTo(topX[j], topY[j]);
    ctx.lineTo(bottomX[j], bottomY[j]);
    ctx.stroke();

    if (bottomX[k] < bottomX[j]) {
        ctx.beginPath();
        ctx.moveTo(topX[k], topY[k]);
        ctx.lineTo(bottomX[k], bottomY[k]);
        ctx.stroke();
    }
    
    if (transparent) {
        ctx.beginPath();
        ctx.moveTo(topX[h], topY[h]);
        ctx.lineTo(bottomX[h], bottomY[h]);
        ctx.stroke();
    }
    
}

// modulus function for negative x
function mod(x, y) {
    return (x + y) % y;
}