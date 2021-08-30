const filePicker = document.getElementById("file-picker");
const file = document.getElementById("file");
const drawBtn = document.getElementById("draw");

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");

var things = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.paddingLeft = "50px";
canvas.style.paddingTop = "50px";

document.body.appendChild(canvas);

filePicker.addEventListener("click", () => {
	file.click();
});

file.addEventListener("change", () => {
	var fr = new FileReader();
	fr.onload = function() {
		var thingsJSON = fr.result.split("\n");

		for (let thing of thingsJSON) {
			try 
			{	
				let thingJSON = JSON.parse(thing);
				if (thingJSON) {
					things.push(thingJSON);
				}
			}
			catch(ex)
			{
				console.error(ex);
			}
		}

		drawBtn.removeAttribute("disabled");
	}
	fr.readAsText(file.files[0]);
});

var i = 0;

function a() {
	if (i < things.length) {
		draw(things[i], i);
		i++;
		//requestAnimationFrame(a);
	}
}

drawBtn.onclick = function() {
	i = 0;
	//requestAnimationFrame(a);
	setInterval(a, 1000/24);
}

function draw(things, number) {
	context.fillStyle = "white";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "black";

	context.beginPath();

	for (let stroke of things.drawing) {
		context.moveTo(stroke[0][0], stroke[1][0]);
		for (let j = 0; j < stroke[0].length-1; j++) {
			context.lineTo(stroke[0][1 + j], stroke[1][1 + j]);
		}
	}

	context.stroke();

	context.fillText(number, 300, 128);
	context.resetTransform();
}