const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");

const extractText = async (file) => {
    if (!file) {
        throw new Error("No file was uploaded.");
    }
    const ext = file.originalname.split(".").pop().toLowerCase();

    // ---------- PDF ----------
    if (ext === "pdf") {
        try {
            // Use pdfjs-dist legacy dynamically (since it is ESM)
            const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
            const workerPath = path.resolve(__dirname, "../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs");
            // Normalize path to file:// protocol for ESM loader on Windows
            const workerUrl = "file:///" + workerPath.replace(/\\/g, "/");
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

            const pdfData = new Uint8Array(fs.readFileSync(file.path));
            const loadingTask = pdfjsLib.getDocument({
                data: pdfData,
                useSystemFonts: true,
                disableFontFace: true
            });
            const doc = await loadingTask.promise;
            let fullText = "";

            for (let i = 1; i <= doc.numPages; i++) {
                const page = await doc.getPage(i);
                const content = await page.getTextContent();
                const pageText = content.items.map(item => item.str).join(" ");
                fullText += pageText + "\n";
            }
            return fullText;
        } catch (pdfError) {
            console.error("PDF Parsing Error with pdfjs-dist:", pdfError);
            throw new Error(`Failed to parse PDF document: ${pdfError.message}`);
        }
    }

    // ---------- Image ----------
    if (["jpg", "jpeg", "png"].includes(ext)) {
        try {
            const result = await Tesseract.recognize(
                file.path,
                "eng"
            );
            return result.data.text;
        } catch (tesseractError) {
            console.error("OCR Extraction Error:", tesseractError);
            throw new Error(`Failed to read text from image: ${tesseractError.message}`);
        }
    }

    throw new Error(`Unsupported file type: .${ext}`);
};

module.exports = extractText;