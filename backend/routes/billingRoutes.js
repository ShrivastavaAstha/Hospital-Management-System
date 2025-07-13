const express = require("express");
const router = express.Router();
const {
  createBill,
  getBills,
  downloadInvoice,
  deleteBill,
} = require("../controllers/billingController");

router.post("/create", createBill); // POST /api/billing/create
router.get("/", getBills); // GET /api/billing
router.get("/download/:id", downloadInvoice); // GET /api/billing/download/:id
router.delete("/:id", deleteBill); // DELETE /api/billing/:id

module.exports = router;
