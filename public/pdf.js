const [
	patternNameInput,
	authorInput,
	imageInput,
	yarnInput,
	amountInput,
	hookInput,
	gaugeInput
] = document.querySelectorAll("#default-inputs input");

const abbrevInputs = document.getElementsByClassName("abbrev");
const customInputs = document.getElementsByClassName("custom");

const pdfDoc = document.querySelector("#pdf");
const pdfPatternName = document.querySelector("#pdf-header h2");
const pdfAuthor = document.querySelector("#pdf-header em");
const pdfImage = document.querySelector("#pdf-image");
const [ pdfYarn, pdfAmount, pdfHook ] = document.querySelectorAll("#pdf-materials p");
const pdfGauge = document.querySelector("#pdf-gauge p");
const pdfAbbrev = document.querySelector("#pdf-abbrev");
const pdfCustom = document.querySelector("#pdf-custom");
const getBtn = document.querySelector("#get-pdf");

form.addEventListener("submit", function (event) {
	event.preventDefault();
	pdfDoc.classList.remove("hidden");
	getBtn.classList.remove("hidden");

	inputToPdf(patternNameInput, pdfPatternName, "", "Crochet Pattern");
	inputToPdf(authorInput, pdfAuthor, "by");
	inputToPdf(yarnInput, pdfYarn, "Yarn:");
	if (yarnInput.value) inputToPdf(amountInput, pdfAmount, "Amount:");
	inputToPdf(hookInput, pdfHook, "Hook size:");
	inputToPdf(gaugeInput, pdfGauge, "Gauge:");

	if (imageInput.value && imageInput.files[0].type.match("image.*")) {
		const reader = new FileReader();
		reader.readAsDataURL(imageInput.files[0]);
		reader.addEventListener("load", () => {
			pdfImage.innerHTML = `
			<img src="${reader.result}">
		`;
		});
	} else {
		pdfImage.innerHTML = "";
	}

	if (abbrevInputs[0].value && abbrevInputs[1].value) {
		pdfAbbrev.innerHTML = "Abbreviations:";
		const ul = document.createElement("ul");

		for (let i = 0; i < abbrevInputs.length; i += 2) {
			if (abbrevInputs[i].value && abbrevInputs[i + 1].value) {
				const li = document.createElement("li");
				li.innerText = `${abbrevInputs[i].value} - ${abbrevInputs[i + 1].value}`;
				ul.appendChild(li);
			}
		}
		pdfAbbrev.appendChild(ul);
	}

	pdfCustom.innerHTML = "";
	for (const input of customInputs) {
		if (input.value) {
			if (input.classList.contains("row")) {
				const div = document.createElement("div");
				div.innerText = `${input.parentElement.innerText} ${input.value}`;
				pdfCustom.appendChild(div);
			} else if (input.classList.contains("image") && input.files[0].type.match("image.*")) {
				const reader = new FileReader();
				reader.readAsDataURL(input.files[0]);
				const div = document.createElement("div");
				div.classList.add("pdf-images");
				reader.addEventListener("load", () => {
					div.innerHTML = `
					<img src="${reader.result}">
				`;
				});
				pdfCustom.appendChild(div);
			} else if (input.classList.contains("heading")) {
				const h3 = document.createElement("h3");
				h3.innerText = input.value;
				pdfCustom.appendChild(h3);
			} else if (input.classList.contains("text")) {
				const p = document.createElement("p");
				p.innerText = input.value;
				pdfCustom.appendChild(p);
			}
		}
	}
});

const inputToPdf = (input, domElement, beginWith = "", alternative = "") => {
	if (input.value) {
		domElement.innerText = `${beginWith} ${input.value}`;
	} else {
		domElement.innerText = `${alternative}`;
	}
};

// PDF download logic
const downloadPDF = () => {
	const content = pdfDoc.innerHTML;
	console.log(content);
	const formData = new FormData();
	formData.append("content", content);
	fetch("/pdf", {
		body   : formData,
		method : "POST"
	}).then((res) => {
		return res
			.arrayBuffer()
			.then((res) => {
				const blob = new Blob([ res ], { type: "application/pdf" });
				saveAs(blob, "crochet-pattern.pdf");
			})
			.catch((e) => alert("Something went wrong, please try again."));
	});
};

getBtn.addEventListener("click", () => {
	downloadPDF();
});
