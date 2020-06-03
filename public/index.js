const [ headingBtn, textBtn, imgBtn, toggleBtn, rowBtn, rowResetBtn ] = document.querySelectorAll("#buttons button");
const customInputsDiv = document.querySelector("#custom-inputs");
const insertAbbrevBtn = document.querySelector("#abbrev-wrap span:first-child");
const form = document.querySelector("form");
let rowCount = 1;
let mode = "Row";

form.style.height = "625px";
const setFormHeight = (amount) => {
	const height = parseInt(form.style.height) + amount;
	form.style.height = `${height}px`;
};

const addClasses = (div, className = "other") => {
	setTimeout(() => {
		div.classList.add("appear", className);
	}, 10);
};

headingBtn.addEventListener("click", () => {
	const div = document.createElement("div");
	div.innerHTML = `
        <label>
            Heading:
            <input type="text" class="custom heading">
        </label>
        <i class="fas fa-times-circle"></i>
    `;
	customInputsDiv.appendChild(div);
	addClasses(div);
	setFormHeight(75);
});

textBtn.addEventListener("click", () => {
	const div = document.createElement("div");
	div.classList.add("pdf-text");
	div.innerHTML = `
        <label>
            Text:
            <textarea rows="3" class="custom text"></textarea>
        </label>
        <i class="fas fa-times-circle"></i>
    `;
	customInputsDiv.appendChild(div);

	addClasses(div, "text");
	setFormHeight(120);
});

imgBtn.addEventListener("click", () => {
	const div = document.createElement("div");
	div.innerHTML = `
        <label>Image:
            <input type="file" class="custom image"></input>
        </label>
        <i class="fas fa-times-circle"></i>
    `;
	customInputsDiv.appendChild(div);

	addClasses(div);
	setFormHeight(75);
});

toggleBtn.addEventListener("click", function () {
	this.firstChild.classList.toggle("fa-exchange-alt");
	this.firstChild.classList.toggle("fa-circle-notch");

	const condition = this.firstChild.classList.contains("fa-exchange-alt");
	mode = condition ? "Row" : "Round";
});

rowBtn.addEventListener("click", () => {
	document.querySelectorAll(".delete-row").forEach((icon) => {
		icon.remove();
	});

	const div = document.createElement("div");
	div.innerHTML = `
    <label>
        ${mode} ${rowCount}:
        <input type="text" class="custom row">
    </label>
        <i class="fas fa-times-circle delete-row"></i>
    `;
	customInputsDiv.appendChild(div);

	addClasses(div, "row");
	setFormHeight(75);
	rowCount++;
});

rowResetBtn.addEventListener("click", () => {
	rowCount = 1;
});

insertAbbrevBtn.addEventListener("click", () => {
	const span = document.createElement("span");
	span.innerHTML = `
        <input type="text" class="abbrev"> = <input type="text" class="abbrev">
	`;
	setFormHeight(30);
	document.querySelector("#abbrev-wrap").appendChild(span);
});

document.addEventListener("click", ({ target }) => {
	if (target.matches(".fa-times-circle")) {
		target.parentElement.classList.remove("appear");
		if (target.parentElement.matches(".text")) {
			setFormHeight(-120);
		} else {
			setFormHeight(-75);
		}

		setTimeout(() => {
			if (target.parentElement.matches(".row")) {
				const rows = document.querySelectorAll("div.row");
				console.log(rows);
				if (rows.length > 1) {
					const icon = document.createElement("i");
					icon.classList.add("fas", "fa-times-circle", "delete-row");
					rows[rows.length - 2].appendChild(icon);
				}
				if (rowCount > 1) rowCount--;
			}

			target.parentElement.remove();
		}, 500);
	}
});
