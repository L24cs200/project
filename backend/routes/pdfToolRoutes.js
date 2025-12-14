const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PDFDocument, degrees } = require('pdf-lib'); // Correct Single Import
const pdfParse = require('pdf-parse');
const { Document, Packer, Paragraph, TextRun } = require('docx');

// 1. Configure Multer (Store files in memory)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// ==========================================
// TOOL 1: MERGE PDF
// ==========================================
router.post('/merge', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) return res.status(400).json({ msg: "Upload at least 2 PDFs." });

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const srcPdf = await PDFDocument.load(file.buffer);
      const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Merge Error:", error);
    res.status(500).json({ msg: "Merge failed", error: error.message });
  }
});

// ==========================================
// TOOL 2: SPLIT PDF
// ==========================================
router.post('/split', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded." });
    const { pageRange } = req.body;
    if (!pageRange) return res.status(400).json({ msg: "No page range provided." });

    const srcPdf = await PDFDocument.load(req.file.buffer);
    const newPdf = await PDFDocument.create();
    const totalPages = srcPdf.getPageCount();

    const pagesToKeep = new Set();
    const parts = pageRange.split(',');

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) pagesToKeep.add(i - 1);
        }
      } else {
        const page = parseInt(part.trim());
        if (!isNaN(page)) pagesToKeep.add(page - 1);
      }
    }

    const indices = Array.from(pagesToKeep).filter(i => i >= 0 && i < totalPages);
    if (indices.length === 0) return res.status(400).json({ msg: "Invalid range." });

    const copiedPages = await newPdf.copyPages(srcPdf, indices);
    copiedPages.forEach(page => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=split.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Split Error:", error);
    res.status(500).json({ msg: "Split failed", error: error.message });
  }
});

// ==========================================
// TOOL 3: ROTATE PDF
// ==========================================
router.post('/rotate', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded." });
    const rotationAngle = parseInt(req.body.angle);

    if (isNaN(rotationAngle) || rotationAngle % 90 !== 0) return res.status(400).json({ msg: "Invalid angle." });

    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + rotationAngle));
    });

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=rotated.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Rotate Error:", error);
    res.status(500).json({ msg: "Rotate failed", error: error.message });
  }
});

// ==========================================
// TOOL 4: COMPRESS PDF
// ==========================================
router.post('/compress', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded." });

    const srcPdf = await PDFDocument.load(req.file.buffer);
    const newPdf = await PDFDocument.create();

    const copiedPages = await newPdf.copyPages(srcPdf, srcPdf.getPageIndices());
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save({ useObjectStreams: true });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=compressed.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Compress Error:", error);
    res.status(500).json({ msg: "Compression failed", error: error.message });
  }
});

// ==========================================
// TOOL 5: IMAGES TO PDF (New)
// ==========================================
router.post('/img-to-pdf', upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ msg: "Upload at least one image." });

    const newPdf = await PDFDocument.create();

    for (const file of req.files) {
      let image;
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        image = await newPdf.embedJpg(file.buffer);
      } else if (file.mimetype === 'image/png') {
        image = await newPdf.embedPng(file.buffer);
      } else {
        continue; 
      }

      const { width, height } = image.scale(1);
      const page = newPdf.addPage([width, height]);
      page.drawImage(image, { x: 0, y: 0, width, height });
    }

    const pdfBytes = await newPdf.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=images.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Img2Pdf Error:", error);
    res.status(500).json({ msg: "Conversion failed", error: error.message });
  }
});

// ==========================================
// TOOL 6: PDF TO WORD
// ==========================================
router.post('/pdf-to-word', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded." });

    const pdfData = await pdfParse(req.file.buffer);
    const textContent = pdfData.text;
    const lines = textContent.split('\n');
    
    const doc = new Document({
      sections: [{
        children: lines.map(line => 
          new Paragraph({ children: [new TextRun(line)], spacing: { after: 100 } })
        ),
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.docx');
    res.send(buffer);
  } catch (error) {
    console.error("PDF2Word Error:", error);
    res.status(500).json({ msg: "Conversion failed", error: error.message });
  }
});

module.exports = router;