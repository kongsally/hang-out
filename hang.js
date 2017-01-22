var a3, d4, eflat4, fsharp4, g4, a4, bflat4, csharp5, d5;
var canvas;
var width, height; // canvas width and height
var colors = ["#F771BC", "#8A62D1", "#E3CEEE", "#FFFFFF", "#C9A5E0", "#9B4CC3", "#D51E9E", "#F10289", "#A434B6"];
var offSet = 140;

var noteRadius = 13;
var grooveRadius = 35;

var noteCenters = [];
var noteSounds = [];
var selectedNotes = [];

var t = 0;

function setup() {
	a3 = document.getElementById("a3");
	d4 = document.getElementById("d4");
	eflat4 = document.getElementById("eflat4");
	fsharp4 = document.getElementById("fsharp4");
	g4 = document.getElementById("g4");
	a4 = document.getElementById("a4");
	bflat4 = document.getElementById("bflat4");
	csharp5 = document.getElementById("csharp5");
	d5 = document.getElementById("d5");

	noteSounds = [a3, a4, csharp5, d5, bflat4, g4, eflat4, d4, fsharp4];

	canvasElement = document.getElementById("hang");
	canvasElement.addEventListener("click", onClick, false);
    canvas= canvasElement.getContext('2d');

    width = canvasElement.width;
    height = canvasElement.height;

    setNoteCenters();

    return setInterval(draw, 30);

}

function draw() {
	clearCanvas();
    drawHang();
    drawNotes();
    drawLines();
}

function clearCanvas() {
	canvas.fillStyle="#ffffff";
    canvas.fillRect(0,0,width,height);
}

function drawHang() {
	var shadow=canvas.createLinearGradient(
		width/2, height,
		width/2, 0);
	shadow.addColorStop(0,"#cccccc");
	shadow.addColorStop(1,"#ffffff");
	canvas.fillStyle = shadow;
	canvas.beginPath();
	canvas.arc(parseInt(width/2), parseInt(height/2) + 3, 
		217, 0, 2*Math.PI);
	canvas.fill();

	var gradient=canvas.createLinearGradient(
		width/2, height,
		width/2, 0);
	gradient.addColorStop(0,"#1B20EC");
	gradient.addColorStop(1,"#6295F6");
	canvas.fillStyle=gradient;
	canvas.beginPath();
	canvas.arc(parseInt(width/2), parseInt(height/2), 
		215, 0, 2*Math.PI);
	canvas.fill();
}

function setNoteCenters() {
	noteCenters[0] = {
		x: width/2,
		y: height/2
	};
	for(var i = 1; i <= 8; i++) {
		var theta = (i-1) * (-2*Math.PI /8);
		var circleX = parseInt(width/2) + offSet * Math.cos(theta);
		var circleY = parseInt(height/2) + offSet * Math.sin(theta);
		noteCenters[i] = {
			x: circleX,
			y: circleY
		};
	}
}

function drawNotes() {

	// ding groove
	canvas.fillStyle = "rgba(40,40,40,0.2)";
	canvas.beginPath();
	var circleX = parseInt(width/2);
	var circleY = parseInt(height/2);
	canvas.arc(circleX, circleY,
		grooveRadius, 
		0, 2*Math.PI, true);
	canvas.fill();

	// ding
	canvas.fillStyle = colors[0];
	canvas.beginPath();
	canvas.arc(circleX, circleY,
		noteRadius, 
		0, 2*Math.PI);
	canvas.fill();

	// rest of the notes
	for(var i = 1; i <= 8; i++) {
		var theta = (i-1) * (-2*Math.PI /8);

		// draw groove
		canvas.fillStyle = "rgba(40,40,40,0.2)";
		canvas.beginPath();
		var circleX = parseInt(width/2) + offSet * Math.cos(theta);
		var circleY = parseInt(height/2) + offSet * Math.sin(theta);
		canvas.arc(circleX, circleY,
			grooveRadius, 
			0, 2*Math.PI, true);
		canvas.fill();

		// draw note
		canvas.fillStyle = colors[i];
		canvas.beginPath();
		var circleX = parseInt(width/2) + offSet * Math.cos(theta);
		var circleY = parseInt(height/2) + offSet * Math.sin(theta);
		canvas.arc(circleX, circleY,
			noteRadius, 
			0, 2*Math.PI, true);
		canvas.fill();
	}
}

function drawLines() {
	for (var i = 1; i < selectedNotes.length; i++) {
		var pNoteIndex = selectedNotes[i-1];
		var noteIndex = selectedNotes[i];
		var gradient=canvas.createLinearGradient(
			noteCenters[pNoteIndex].x, noteCenters[pNoteIndex].y,
			noteCenters[noteIndex].x, noteCenters[noteIndex].y);
		gradient.addColorStop(0,colors[pNoteIndex]);
		gradient.addColorStop(1,colors[noteIndex]);
		canvas.strokeStyle=gradient;
		canvas.lineWidth = 5;

		canvas.beginPath();
		canvas.moveTo(noteCenters[pNoteIndex].x, noteCenters[pNoteIndex].y);
		canvas.lineTo(noteCenters[noteIndex].x, noteCenters[noteIndex].y);
		canvas.stroke();
	}
}


function vectorLength(x, y) {
	var xd = x - width/2;
	var yd = y - height/2;

	return Math.sqrt(xd*xd + yd*yd);
}

function noteIntersecion(mx, my) {
	var intersected = -1;
	for(var i = 0; i < noteCenters.length; i++) {
		var nx = noteCenters[i].x;
		var ny = noteCenters[i].y;
		if (Math.hypot(mx-nx, my-ny) < (noteRadius + 20)) {
			intersected = i;
			break;
		}
	}

	if (intersected > -1) {
		console.log(intersected);
		selectedNotes.push(intersected);
		canvas.fillStyle = colors[1];
		canvas.beginPath();
		var circleX = noteCenters[1].x + offSet * Math.cos(0);
		var circleY = noteCenters[1].y + offSet * Math.sin(0);
		canvas.arc(circleX, circleY,
			noteRadius, 
			0, 2*Math.PI, true);
		canvas.fill();

		noteSounds[intersected].cloneNode().play();
		canvas.fillStyle = colors[intersected];
		canvas.arc(noteCenters[intersected].x, 
			noteCenters[intersected].y,
				noteRadius + 10, 
				0, 2*Math.PI, true);
		canvas.fill();
	}
}

function reset() {
	selectedNotes = [];
}

function onClick(e) {
	var mx = e.layerX;
	var my = e.layerY;
	noteIntersecion(mx, my);
}
