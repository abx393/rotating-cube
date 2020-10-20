// Given Canvas.Context object, traces and fills the top edge of the cube
function fillTop(ctx, topX, topY, fillColor) {
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(topX[0], topY[0]);
    
    for (let i = 1; i < 4; i++) {
        ctx.lineTo(topX[i], topY[i]);
    }
    ctx.fillStyle = fillColor;
    ctx.fill();
}

// Trace and fill bottom face of cube
function fillBottom(ctx, bottomX, bottomY, fillColor) {
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(bottomX[0], bottomY[0]);
    
    for (let i = 1; i < 4; i++) {
        ctx.lineTo(bottomX[i], bottomY[i]);
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
    for (let i = 0; i < 4; i++) {
        ctx.lineWidth = 1;
        ctx.beginPath();

        var curr = i * 2;
        var next = (i * 2 + 5) % 8;

        ctx.moveTo(topInnerX[curr], topInnerY[curr]);
        ctx.lineTo(topInnerX[next], topInnerY[next]);
        ctx.stroke();
    }
}
    
// Draw inner lines of bottom face
function drawInnerBottomLines(ctx, bottomInnerX, bottomInnerY) {
    for (let i = 0; i < 4; i++) {
        ctx.lineWidth = 1;
        ctx.beginPath();

        var curr = i * 2;
        var next = (i * 2 + 5) % 8;

        ctx.moveTo(bottomInnerX[curr], bottomInnerY[curr]);
        ctx.lineTo(bottomInnerX[next], bottomInnerY[next]);
        ctx.stroke();
    }
}

// Draw vertical inner lines
function drawInnerVerticalLines(ctx, topInnerX, topInnerY, bottomInnerX, bottomInnerY) {
    for (let i = 0; i < 8; i++) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(topInnerX[i], topInnerY[i]);
        ctx.lineTo(bottomInnerX[i], bottomInnerY[i]);
        ctx.stroke();
    }
}

// Draw horizontal inner lines
function drawInnerHorizontalLines(ctx, midInnerX, midInnerY) {
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
        var index = mod(i * 2 + 2, 8);
        ctx.moveTo(midInnerX[i * 2], midInnerY[i * 2]);
        ctx.lineTo(midInnerX[index], midInnerY[index]);

        index = mod(index + 1, 8);
        ctx.moveTo(midInnerX[i * 2 + 1], midInnerY[i * 2 + 1]);
        ctx.lineTo(midInnerX[index], midInnerY[index]);
    }
    ctx.stroke();
}

// Draw edges
function drawEdges(ctx, topX, topY, bottomX, bottomY) {
    drawTopEdges(ctx, topX, topY);
    drawBottomEdges(ctx, bottomX, bottomY, true, 0);
    drawVerticalEdges(ctx, topX, topY, bottomX, bottomY, true, 0);
}

// Draw top edges
function drawTopEdges(ctx, topX, topY) {
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(topX[i], topY[i]);
        ctx.lineTo(topX[(i + 1) % 4], topY[(i + 1) % 4]);
        ctx.stroke();
    }
}

// Draw bottom edges
function drawBottomEdges(ctx, bottomX, bottomY, transparent, index) {
    var i = mod(index - 1, 4);
    var j = index;
    var k = mod(index + 1, 4);
    var h = mod(index + 2, 4);
    
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
function drawVerticalEdges(ctx, topX, topY, bottomX, bottomY, transparent, index) {
    var i = mod(index - 1, 4); 
    var j = index;
    var k = mod(index + 1, 4);
    var h = mod(index + 2, 4);
    
    ctx.beginPath();
    ctx.moveTo(topX[i], topY[i]);
    ctx.lineTo(bottomX[i], bottomY[i]);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(topX[j], topY[j]);
    ctx.lineTo(bottomX[j], bottomY[j]);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(topX[k], topY[k]);
    ctx.lineTo(bottomX[k], bottomY[k]);
    ctx.stroke();
    
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