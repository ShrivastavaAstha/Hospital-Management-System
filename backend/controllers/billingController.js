const Bill = require("../models/Bill");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Create a bill & generate PDF
exports.createBill = async (req, res) => {
  try {
    const bill = new Bill(req.body);
    await bill.save();

    // Create PDF
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../invoices/${bill._id}.pdf`);
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("Hospital Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Patient Name: ${bill.patientName}`);
    doc.text(`Doctor: ${bill.doctorName}`);
    doc.text(`Date: ${new Date(bill.createdAt).toLocaleString()}`);
    doc.moveDown();

    doc.text("Services:");
    bill.services.forEach((s, i) => {
      doc.text(`${i + 1}. ${s.description} - ₹${s.amount}`);
    });

    doc.moveDown();
    doc
      .fontSize(16)
      .text(`Total Amount: ₹${bill.totalAmount}`, { align: "right" });

    doc.end();

    res.status(201).json({ message: "Bill created", billId: bill._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Bills
exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Download PDF invoice
exports.downloadInvoice = (req, res) => {
  const filePath = path.join(__dirname, `../invoices/${req.params.id}.pdf`);
  res.download(filePath, `invoice-${req.params.id}.pdf`);
};

// Delete Bill
exports.deleteBill = async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    const filePath = path.join(__dirname, `../invoices/${req.params.id}.pdf`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
