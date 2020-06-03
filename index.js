const express = require("express");
const multer = require("multer");
const puppeteer = require("puppeteer");
const app = express();
//storage?
const upload = multer({
	storage : multer.memoryStorage(),
	limits  : { fieldSize: 25 * 1024 * 1024 }
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.post("/pdf", upload.none(), async (req, res) => {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.setContent(req.body.content);
		await page.addStyleTag({ path: "public/pdf.css" });
		await page.emulateMediaType("screen");
		const buffer = await page.pdf({ format: "A4" });
		await browser.close();
		res.end(buffer);
	} catch (err) {
		res.redirect("/");
	}
});

app.listen(3000, () => {
	console.log("puppet has started");
});
