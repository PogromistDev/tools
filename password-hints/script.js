const password = document.getElementById("password");
const passwordInput = document.getElementById("password-input");

passwordInput.addEventListener("input", e => {
	hintPassword();
});

function hintPassword() {
	const value = passwordInput.value;

	let resultHTML = "";
	let buffer = "";
	let currentType = "";

	for (let char of value) {
		let type = "";

		if (/\d/.test(char)) {
			type = "digit";
		} else if (/[a-z]/.test(char)) {
			type = "lower-case-letter";
		} else if (/[A-Z]/.test(char)) {
			type = "upper-case-letter";
		} else {
			type = "special";
		}

		if (type === currentType) {
			buffer += char;
		} else {
			if (buffer) {
				resultHTML += `<span class="${currentType}">${buffer}</span>`;
			}
			buffer = char;
			currentType = type;
		}
	}


	if (buffer) {
		resultHTML += `<span class="${currentType}">${buffer}</span>`;
	}

	password.innerHTML = resultHTML;
}