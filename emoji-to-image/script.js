const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const range = document.getElementById("range");

const emoji = document.getElementById("emoji");
const shadow = document.getElementById("shadow");
const emojiPickerWrapper = document.getElementById("emoji-picker-wrapper");
const emojiPicker = document.getElementById("emoji-picker");
const emojiContainer = document.getElementById("emoji-container");

const custom = document.getElementById("custom");

const saveToFile = document.getElementById("save-to-file");
const saveToFileA = document.getElementById("save-to-file-a");

const copyToClipboard = document.getElementById("copy-to-clipboard");

canvas.width = 640;
canvas.height = 480;

var scale = 100;
const emojis = [
	'😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '🥲', '😚', '🙂', '🤗', '🤩', '🤔', '🫡', '🤨', '😐', '😑', '😶', '🫥', '😶‍🌫️', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🫤', '🙃', '🫠', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😮‍💨', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '😵‍💫', '🥴', '😠', '😡', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🥳', '🥸', '🥺', '🥹', '🤠', '🤡', '🤥', '🫨', '🤫', '🤭', '🫢', '🫣', '🧐', '😈', '👿', '👹', '👺', '💀', '☠️', '👻', '👽', '👾', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '🐵', '🐶', '🐺', '🐱'
];

var choosenEmoji = '';
var turn = false;

window.addEventListener("resize", updateCanvas);

range.addEventListener("change", () => {
	scale = range.value;
});

emoji.addEventListener("click", e => {
	toggleEmojiPicker();
});

shadow.addEventListener("mousedown", e => {
	if (e.target.id == "shadow") hideEmojiPicker();
});

emojiPicker.addEventListener("click", e => {
	if (e.target.classList.contains("emoji")) {
		[...emojiContainer.children].forEach(node => node.classList.remove("emoji-choosen"));
		e.target.classList.add("emoji-choosen");

		chooseEmoji(e.target.innerHTML);
		hideEmojiPicker();
	}
});

custom.addEventListener("keydown", e => {
	if (e.key == "Enter") {
		[...emojiContainer.children].forEach(node => node.classList.remove("emoji-choosen"));
		chooseEmoji(custom.value);
	}
});

function canvasToBlob(canvas) {
	return new Promise((resolve, reject) => {
		canvas.toBlob(blob => {
			if (blob) {
				resolve(blob);
			} else {
				reject();
			}
		})
	});
}

copyToClipboard.addEventListener("click", async () => {
	try {
		const { state } = await navigator.permissions.query({ name: "clipboard-write" });
		if (state === "granted") {
			try {
				const blob = await canvasToBlob(canvas);
				await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
			} 
			catch (e) {
				console.error(e);
			}
		}
	}
	catch (e) {
		console.error(e);
	}
});

saveToFile.addEventListener("click", async () => {
	try {
		const blob = await canvasToBlob(canvas);
		saveToFileA.setAttribute("download", "emoji-image.png");
		saveToFileA.href = URL.createObjectURL(blob);
		saveToFileA.click();
	} 
	catch (e) {
		console.error(e);
	}
});

//

function generateEmojis() {
	emojis.forEach(currentEmoji => emojiContainer.insertAdjacentHTML("beforeend", `<button class="emoji">${currentEmoji}</button>`));
	const emojiButtons = [...emojiContainer.children];
	emojiButtons[Math.floor(Math.random() * emojiButtons.length)].click();
}

function updateCanvas() {
	canvas.width = window.outerWidth;
	canvas.height = window.outerHeight;

	updateEmojiPicker();
}

function updateEmojiPicker() {
	const emojiBoundingRect = emoji.getBoundingClientRect();

	const emojiButtonWidth = emojiBoundingRect.width;
	const emojiPickerWrapperWidth = emojiPicker.getBoundingClientRect().width;

	const newLeft = emojiBoundingRect.right - (emojiButtonWidth / 2) - (emojiPickerWrapperWidth / 2);

	emojiPickerWrapper.style.left = `${newLeft}px`;
	emojiPickerWrapper.style.top = `${emojiBoundingRect.bottom}px`;
}

function chooseEmojiRandomly() {
	choosenEmoji = emojis[Math.floor(Math.random() * emojis.length)];
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.textBaseline = "middle";
	ctx.font = `${scale}px serif`;

	const textWidth = ctx.measureText(choosenEmoji).width;
	ctx.fillText(choosenEmoji, canvas.width / 2 - textWidth / 2, canvas.height / 2 + 58);

	requestAnimationFrame(draw);
}

generateEmojis();
updateCanvas();
draw();


function chooseEmoji(newEmoji) {
	emoji.innerHTML = newEmoji;
	choosenEmoji = newEmoji;
}

function showEmojiPicker() {
	emoji.classList.add("emoji-active");
	shadow.style.display = "unset";

	updateEmojiPicker();
}

function hideEmojiPicker() {
	emoji.classList.remove("emoji-active");
	shadow.style.display = "none";
}

function toggleEmojiPicker() {
	if (shadow.style.display == "none") {
		showEmojiPicker();
	} else {
		hideEmojiPicker();
	}
}