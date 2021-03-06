const urlRadio = document.getElementById("urlRadio");
const fileRadio = document.getElementById("fileRadio");

const fileBrowser = document.getElementById("fileBrowser");
const browseFile = document.getElementById("browseFile");

const urlInput = document.getElementById("url");
const convert = document.getElementById("convert");
let output = document.getElementById("output");

const highlightCheckbox = document.getElementById("highlightCheckbox");

const copy = document.getElementById('copy-to-clipboard');
const save = document.getElementById('save-to-file-a');

let loadFile = true;

let canvas = null;
let imageData = null;

urlRadio.addEventListener("click", e => {
	urlInput.removeAttribute("hidden");
	browseFile.setAttribute("hidden", "");

	loadFile = false;
});

fileRadio.addEventListener("click", e => {
	urlInput.setAttribute("hidden", "");
	browseFile.removeAttribute("hidden");

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

copy.addEventListener("click", e => {
	navigator.permissions.query({ name: 'clipboard-write' })
	.then(result => {
		if (result.state == 'granted' || result.state == 'prompt') {
			navigator.clipboard.writeText(output.innerText);
		}
	}, err => console.error(err));
});

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

		output.innerHTML = outputString;
		if (highlightCheckbox.checked) {
			hljs.highlightBlock(output.parentElement);
		}

		URL.revokeObjectURL(save.href);
		let blob = new Blob([output.innerText], { type: "text/plain" });
		save.href = URL.createObjectURL(blob);

		output = document.getElementById("output");
		delete imageData;
	}
}