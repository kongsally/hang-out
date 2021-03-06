var a3, d4, eflat4, fsharp4, g4, a4, bflat4, csharp5, d5;
var canvas;
var width, height; // canvas width and height
var colors = ["#F771BC", "#8A62D1", "#E3CEEE", "#FFFFFF", "#C9A5E0", "#9B4CC3", "#D51E9E", "#F10289", "#A434B6"];
var offSet = 140;
var crossPatternColor = "#FFE700";
var crossPattern = [7,6,8,5,1,4,2,3];

var noteRadius = 13;
var grooveRadius = 35;

var noteCenters = [];
var noteSounds = [];
var selectedNotes = [];

var t = 0;
var isPlaying = false;
var lastNotePlayed = true;
var strokeWidth = 5;

var patternToggle;

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
	patternToggle = document.getElementById("cross-pattern").parentElement;

	noteSounds = [a3, a4, csharp5, d5, bflat4, g4, eflat4, d4, fsharp4];

	canvasElement = document.getElementById("hang");
	canvasElement.addEventListener("click", onClick, false);
    canvas= canvasElement.getContext('2d');

    width = canvasElement.width;
    height = canvasElement.height;

    setNoteCenters();

    //add rest on space 
    document.body.onkeyup = function(e){
	    if(e.keyCode == 32){
	       addRest();
	    }
	}

    return setInterval(draw, 50);

}

function draw() {
	clearCanvas();
    drawHang();
    drawGrooves();
    drawNotes();
    drawLines();
    if (patternToggle.classList.contains("is-checked")) {
    	  drawPattern();
    }
  
}

function clearCanvas() {
	canvas.fillStyle="rgba(255,255,255,0)";
    canvas.fillRect(0,0,width,height);
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

function drawGrooves() {

	// ding groove
	canvas.fillStyle = "rgba(40,40,40,0.2)";
	canvas.beginPath();
	var circleX = parseInt(width/2);
	var circleY = parseInt(height/2);
	canvas.arc(circleX, circleY,
		grooveRadius, 
		0, 2*Math.PI, true);
	canvas.fill();

	// other note grooves
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
	}
}

function drawNotes() {
	// ding
	var circleX = parseInt(width/2);
	var circleY = parseInt(height/2);
	canvas.fillStyle = colors[0];
	canvas.beginPath();
	canvas.arc(circleX, circleY,
		noteRadius, 
		0, 2*Math.PI);
	canvas.fill();

	// rest of the notes
	for(var i = 1; i <= 8; i++) {
		var theta = (i-1) * (-2*Math.PI /8);

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

		if (selectedNotes[i] === -1 || selectedNotes[i-1] === -1) {
			continue;
		}

		var pNoteIndex = selectedNotes[i-1];
		var noteIndex = selectedNotes[i];
		var prevNoteCenter = noteCenters[pNoteIndex];
		var currentNoteCenter = noteCenters[noteIndex];

		var gradient=canvas.createLinearGradient(
			prevNoteCenter.x, prevNoteCenter.y,
			currentNoteCenter.x, currentNoteCenter.y);
		gradient.addColorStop(0,colors[pNoteIndex]);
		gradient.addColorStop(1,colors[noteIndex]);
		canvas.strokeStyle=gradient;
		canvas.lineWidth = strokeWidth;

		canvas.beginPath();
		canvas.moveTo(prevNoteCenter.x, prevNoteCenter.y);
		canvas.lineTo(currentNoteCenter.x, currentNoteCenter.y);
		canvas.stroke();
	}
}

function drawPattern() {

	canvas.fillStyle = crossPatternColor;
	canvas.lineWidth = 2;
	canvas.beginPath();
	canvas.arc(noteCenters[crossPattern[0]].x, 
		noteCenters[crossPattern[0]].y,
			2, 
			0, 2*Math.PI, true);
	canvas.fill();

	for (var i = 1; i < crossPattern.length; i++) {

		var pNoteIndex = crossPattern[i-1];
		var noteIndex = crossPattern[i];
		var prevNoteCenter = noteCenters[pNoteIndex];
		var currentNoteCenter = noteCenters[noteIndex];

		canvas.fillStyle = crossPatternColor;
		canvas.lineWidth = strokeWidth;
		canvas.beginPath();
		canvas.arc(noteCenters[noteIndex].x, 
			noteCenters[noteIndex].y,
				2, 
				0, 2*Math.PI, true);
		canvas.fill();

		canvas.strokeStyle = crossPatternColor;
		canvas.lineWidth = strokeWidth;
		canvas.beginPath();
		canvas.moveTo(prevNoteCenter.x, prevNoteCenter.y);
		canvas.lineTo(currentNoteCenter.x, currentNoteCenter.y);
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
		isPlaying = false;
		console.log(intersected);
		selectedNotes.push(intersected);
		noteSounds[intersected].cloneNode().play();
		canvas.beginPath();
		canvas.fillStyle = colors[intersected];
		canvas.arc(noteCenters[intersected].x, 
			noteCenters[intersected].y,
				noteRadius + 10, 
				0, 2*Math.PI, true);
		canvas.fill();
	}
}

function reset() {
	stop();
	selectedNotes = [];
}

function onClick(e) {
	var mx = e.layerX;
	var my = e.layerY;
	noteIntersecion(mx, my);
}

function playNotes(start, selectedNote, callback) {
    setTimeout(function () { //The timer
    	if (isPlaying && selectedNote != -1) {
			noteSounds[selectedNote].cloneNode().play();

			canvas.fillStyle = colors[selectedNote];
			canvas.beginPath();
			canvas.arc(noteCenters[selectedNote].x, 
				noteCenters[selectedNote].y,
					noteRadius + 10, 
					0, 2*Math.PI, true);
			canvas.fill();	
    	}
       
        if (start === selectedNotes.length -1) {
    		play();
   		}
    }, (start+1)*400); //needs the "start*" or else all the timers will run at 3000ms

}

function play() {
	if (isPlaying) {
		for (var i = 0; i < selectedNotes.length; i++) {
			var selectedNote = selectedNotes[i];
			playNotes(i, selectedNote);
		}
	}
}

function addRest(){
	isPlaying = false;
	selectedNotes.push(-1);
}

function startPlay() {
	if (!isPlaying) {
		isPlaying = true;
		play();
	}
}

function stop() {
	isPlaying = false;
}
