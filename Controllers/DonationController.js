import express from "express";
import Donation from "../Modules/Donation.js"; 
import errorHandling from "../Middlewares/ErrorHandling.js"; 

const router = express.Router();

router.post("/receiveDonation", errorHandling(async (req, res) => {
  const { donorId, donationType, amount, remarks, date } = req.body;

  // Validate required fields
  if (!donorId || !donationType || !amount) {
    return res.status(400).json({ message: "Please enter complete donation details." });
  }

  // Create new donation record
  const newDonation = await Donation.create({
    donor: donorId,
    donationType,
    amount,
    remarks,
    date
  });

  res.json(newDonation);
}));

export default router;
