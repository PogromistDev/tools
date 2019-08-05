const urlRadio = document.getElementById("urlRadio");
const fileRadio = document.getElementById("fileRadio");

const fileBrowser = document.getElementById("fileBrowser");
const browseFile = document.getElementById("browseFile");

const urlInput = document.getElementById("url");
const convert = document.getElementById("convert");
const output = document.getElementById("output");

let loadFile = true;

let canvas = null;
let imageData = null;

urlRadio.addEventListener("click", e => {
	urlInput.toggleAttribute("hidden");
	browseFile.toggleAttribute("hidden");

	loadFile = false;
});

fileRadio.addEventListener("click", e => {
	urlInput.toggleAttribute("hidden");
	browseFile.toggleAttribute("hidden");

	loadFile = true;
});

urlInput.addEventListener("keydown", e => {
	if (e.which == 13) {
		const image = new Image();
		image.crossOrigin = "Anonymous";

		image.addEventListener("load", () => {
			canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;

			const ctx = canvas.getContext("2d");
			ctx.drawImage(image, 0, 0);

			imageData = ctx.getImageData(0, 0, image.width, image.height);

			delete canvas;
			delete image;
		});

		image.addEventListener("error", e => {
			console.error(e);
		});

		image.src = urlInput.value;
	}
});

browseFile.addEventListener("click", e => {
	fileBrowser.click();
});

fileBrowser.addEventListener("input", e => {
	const file = fileBrowser.files[0];

	const url = URL.createObjectURL(file);

	const image = new Image();

	image.addEventListener("load", () => {
		canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;

		const ctx = canvas.getContext("2d");
		ctx.drawImage(image, 0, 0);

		imageData = ctx.getImageData(0, 0, image.width, image.height);

		delete canvas;
		delete image;
	});

	image.src = url;
});

convert.addEventListener("click", toArray);

function toArray() {
	if (imageData) {
		let { width, height, data } = imageData;
		// let uint8View = new Uint8Array(data);

		let outputString = `using pixel = unsigned char;\nconst unsigned int imageWidth = ${width};\nconst unsigned int imageHeight = ${height};\nconst pixel bits = 32;\n\npixel imageArray[imageWidth * imageHeight * bits] = {\n`;

		let i = 0, offset;

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				offset = i * 4;

				outputString += `\t0x${data[offset].toString("16")}, ` +
					`0x${data[offset + 1].toString("16")}, ` +
					`0x${data[offset + 2].toString("16")}, ` +
					`0x${data[offset + 3].toString("16")},\n`;

				i++;
			}
		}

		outputString += "};";

		output.value = outputString;

		delete imageData;
	}
}