import express from "express";
import Donation from "../Modules/Donation.js"; 
import errorHandling from "../Middlewares/ErrorHandling.js"; 

const router = express.Router();

router.post("/receiveDonation", errorHandling(async (req, res) => {
  const { donorId, donationType, amount, paymentMode, remarks, date } = req.body;

  
  if (!donorId || !donationType || !amount) {
    return res.status(400).json({ message: "Please enter complete donation details." });
  }

  const newDonation = await Donation.create({
    donor: donorId,
    donationType,
    amount,
    paymentMode,
    remarks,
    date
  });

  res.json(newDonation);
}));

router.get("/getReceivedDonations", errorHandling(async (req, res) => {
  const donations = await Donation.find()
    .populate({
      path: "donor",
      populate: ["districtId", "zoneId", "ucId"]
    })
    .populate("donationType", "dontype");

  res.json(donations);
}));

router.get("/getReceivedDonationsById/:id", errorHandling(async (req, res) => {
  const donations = await Donation.findById(req.params.id)
    .populate({
      path: "donor",
      select: "name contact address districtId zoneId ucId",
      populate: [
        { path: "districtId", select: "district" },
        { path: "zoneId", select: "zname" },
        { path: "ucId", select: "uname" }
      ]
    })
    .populate("donationType", "dontype");

  if (!donations) {
    return res.status(404).json({ error: "Donation not found" });
  }

  res.json(donations);
}));







router.put("/updateDonation/:id", errorHandling(async (req, res) => {
  const { donorId, donationType, amount, paymentMode, remarks, date } = req.body;

  if (!donorId || !donationType || !amount) {
    return res.status(400).json({ message: "Please enter complete donation details." });
  }

  const updatedDonation = await Donation.findByIdAndUpdate(
    req.params.id,
    {
      donor: donorId,
      donationType,
      amount,
      paymentMode,
      remarks,
      date
    },
    { new: true }
  )
  .populate({
    path: "donor",
    populate: [
      { path: "districtId", select: "district" },
      { path: "zoneId", select: "zname" },
      { path: "ucId", select: "uname" }
    ],
    select: "name contact address paymentMode"
  })
    .populate("donationType", "dontype");

  if (!updatedDonation) {
    return res.status(404).json({ message: "Donation not found." });
  }

  res.json(updatedDonation);
}));


router.delete("/delDonation/:id", errorHandling (async (req, res) => {
  const delDonation = await Donation.findByIdAndDelete(req.params.id)
  if (!delDonation) return res.status(404).json({message: "Donation not found"})
    res.json({message: "Donation deleted successfully"})
}))


export default router;
