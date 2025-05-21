import express from "express";
import Donation from "../Modules/Donation.js"; 
import errorHandling from "../Middlewares/ErrorHandling.js"; 

const router = express.Router();



router.get("/nextReceiptNumber", errorHandling(async (req, res) => {
  const lastDonation = await Donation.findOne().sort({ receiptNumber: -1 });
  let nextNumber = 1;
  
  if (lastDonation?.receiptNumber) {
    const parts = lastDonation.receiptNumber.split('-');
    nextNumber = parseInt(parts[2]) + 1;
  }
  
  const year = new Date().getFullYear().toString().slice(-2);
  res.json({ nextReceiptNumber: `REC-${year}-${nextNumber.toString().padStart(4, '0')}` });
}));




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

  // Return the donation with the auto-generated receiptNumber
  res.json({
    ...newDonation.toObject(),
    receiptNumber: newDonation.receiptNumber // Ensure this is included
  });
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

router.get("/donationCount", errorHandling(async (req, res) => {
    const donCount = await Donation.countDocuments()
    res.json(donCount)
}))


router.get("/donationTotals", errorHandling(async (req, res) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Add timezone awareness (critical for date matching)
  const timezoneOffset = currentDate.getTimezoneOffset() / 60;
  
  const results = await Donation.aggregate([
    {
      $addFields: {
        numericAmount: { $toDouble: "$amount" },
        // FIXED: Add timezone adjustment to date parsing
        donationYear: { $year: { date: "$date", timezone: `${timezoneOffset}` } },
        donationMonth: { $month: { date: "$date", timezone: `${timezoneOffset}` } }
      }
    },
    {
      $facet: {
        monthly: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$donationMonth", currentMonth] },
                  { $eq: ["$donationYear", currentYear] }
                ]
              }
            }
          },
          { $group: { _id: null, total: { $sum: "$numericAmount" } } }
        ],
        yearly: [
          {
            $match: {
              $expr: { $eq: ["$donationYear", currentYear] }
            }
          },
          { $group: { _id: null, total: { $sum: "$numericAmount" } } }
        ],
        overall: [
          { $group: { _id: null, total: { $sum: "$numericAmount" } } }
        ]
      }
    }
  ]);

  res.json({
    monthlyTotal: results[0].monthly[0]?.total || 0,
    yearlyTotal: results[0].yearly[0]?.total || 0,
    overallTotal: results[0].overall[0]?.total || 0
  });
}));


router.get("/checkDonationDates", async (req, res) => {
  const docs = await Donation.find().sort({ date: -1 }).limit(5);
  
  const results = docs.map(doc => ({
    _id: doc._id,
    amount: doc.amount,
    storedDate: doc.date,
    localDate: new Date(doc.date).toLocaleString(),
    month: new Date(doc.date).getMonth() + 1,
    year: new Date(doc.date).getFullYear()
  }));

  res.json(results);
});

export default router;
