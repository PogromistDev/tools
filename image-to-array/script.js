const urlRadio = document.getElementById("urlRadio");
const fileRadio = document.getElementById("fileRadio");

const fileBrowser = document.getElementById("fileBrowser");
const browseFile = document.getElementById("browseFile");

const urlInput = document.getElementById("url");
const convert = document.getElementById("convert");
let output = document.getElementById("output");

const highlightCheckbox = document.getElementById("highlightCheckbox");
const downloadImmediatelyCheckbox = document.getElementById("downloadImmediatelyCheckbox");

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
	if (e.key == "Enter") {
		const image = new Image();
		image.crossOrigin = "Anonymous";

		image.addEventListener("load", () => {
			canvas = document.createElement("canvas");
			canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;

			const ctx = canvas.getContext("2d");
			ctx.drawImage(image, 0, 0);

			imageData = ctx.getImageData(0, 0, image.naturalWidth, image.naturalHeight);

			delete canvas;
			delete image;
		});

		image.addEventListener("error", err => {
			console.error(err);
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

		// code generation
		let lines = [];

		lines.push(
			"using pixel = unsigned char;",
			`const unsigned int imageWidth = ${width};`,
			`const unsigned int imageHeight = ${height};`,
			"const pixel bytes = 4;", "",
			"pixel imageArray[imageWidth * imageHeight * bytes] = {"
		);

		let i = 0, offset;

		const off = (i, size, off) => i * 4 + off;

		for (let i = 0; i < width * height; i++) {

			lines.push(
				`\t0x${data[off(i, 4, 0)].toString("16")}, ` +
				`0x${data[off(i, 4, 1)].toString("16")}, ` +
				`0x${data[off(i, 4, 2)].toString("16")}, ` +
				`0x${data[off(i, 4, 3)].toString("16")},`,
			);
		}

		lines.push("};");

		//

		if (!downloadImmediatelyCheckbox.checked) {
			output.innerHTML = lines.join("\n");

			if (highlightCheckbox.checked) {
				hljs.highlightBlock(output.parentElement);
			}

			URL.revokeObjectURL(save.href);
			let blob = new Blob([output.innerText], { type: "text/plain" });
			save.href = URL.createObjectURL(blob);
			delete imageData;
		} else {
			URL.revokeObjectURL(save.href);
			let blob = new Blob([lines.join("\n")], { type: "text/plain" });
			save.href = URL.createObjectURL(blob);
			save.click();
			delete imageData;
		}
	}
}