const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const range = document.getElementById("range");

const emoji = document.getElementById("emoji");
const shadow = document.getElementById("shadow");
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
	'😀',
	'😁',
	'😂',
	'😂',
	'🤣',
	'😃',
	'😄',
	'😅',
	'😆',
	'😉',
	'😊',
	'😋',
	'😎',
	'😍',
	'😘',
	'🥰',
	'😗',
	'😙',
	'🥲',
	'😚',
	'🙂',
	'🤗',
	'🤩',
	'🤔',
	'🫡',
	'🤨',
	'😐',
	'😑',
	'😶',
	'🫥',
	'😶‍🌫️',
	'🙄',
	'😏',
	'😣',
	'😥',
	'😮',
	'🤐',
	'😯',
	'😪',
	'😫',
	'🥱',
	'😴',
	'😌',
	'😛',
	'😜',
	'😝',
	'🤤',
	'😒',
	'😓',
	'😔',
	'😕',
	'🫤',
	'🙃',
	'🫠',
	'🤑',
	'😲',
	'☹️',
	'🙁',
	'😖',
	'😞',
	'😟',
	'😤',
	'😢',
	'😭',
	'😦',
	'😧',
	'😨',
	'😩',
	'🤯',
	'😬',
	'😮‍💨',
	'😰',
	'😱',
	'🥵',
	'🥶',
	'😳',
	'🤪',
	'😵',
	'😵‍💫',
	'🥴',
	'😠',
	'😡',
	'🤬',
	'😷',
	'🤒',
	'🤕',
	'🤢',
	'🤮',
	'🤧',
	'😇',
	'🥳',
	'🥸',
	'🥺',
	'🥹',
	'🤠',
	'🤡',
	'🤥',
	'🫨',
	'🤫',
	'🤭',
	'🫢',
	'🫣',
	'🧐',
	'😈',
	'👿',
	'👹',
	'👺',
	'💀',
	'☠️',
	'👻',
	'👽',
	'👾',
	'🤖',
	'💩',
	'😺',
	'😸',
	'😹',
	'😻',
	'😼',
	'😽',
	'🙀',
	'😿',
	'😾',
	'🙈',
	'🙉',
	'🙊',
	'🐵',
	'🐶',
	'🐺',
	'🐱',
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
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	updateEmojiPicker();
}

function updateEmojiPicker() {
	const emojiButtonWidth = emoji.getBoundingClientRect().width;
	const emojiPickerWidth = emojiPicker.getBoundingClientRect().width;

	emojiPicker.style.left = `${emoji.getBoundingClientRect().right - (emojiButtonWidth / 2) - (emojiPickerWidth / 2)}px`;
	emojiPicker.style.top = `${emoji.getBoundingClientRect().bottom + 12}px`;
}

function chooseEmojiRandomly() {
	choosenEmoji = emojis[Math.floor(Math.random() * emojis.length)];
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = `${scale}px serif`;

	const textWidth = ctx.measureText(choosenEmoji).width;
	ctx.fillText(choosenEmoji, canvas.width / 2 - textWidth / 2, canvas.height / 2);

	/*
	if (scale == 300.0) {
		turn = true;
	}
	
	if (scale == 0) {
		turn = false;
	}
	
	scale = (turn ? scale - 0.5 : scale + 0.5);
	*/

	requestAnimationFrame(draw);
}

generateEmojis();
updateCanvas();
draw();

//setInterval(chooseEmojiRandomly, 1000);

//

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