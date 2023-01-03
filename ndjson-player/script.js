const filePicker = document.getElementById("file-picker");
const file = document.getElementById("file");
const drawBtn = document.getElementById("draw");

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var things = [];

canvas.width = 640;
canvas.height = 640;

canvas.style.marginLeft = "58px";
canvas.style.marginTop = "58px";

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
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "black";

	ctx.beginPath();

	for (let stroke of things.drawing) {
		ctx.moveTo(stroke[0][0], stroke[1][0]);
		for (let j = 0; j < stroke[0].length-1; j++) {
			ctx.lineTo(stroke[0][1 + j], stroke[1][1 + j]);
		}
	}

	ctx.stroke();

	ctx.font = "bold 24px serif";
	ctx.fillText(number, 300, 128);
	ctx.resetTransform();
}