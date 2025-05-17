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

router.get("/donationCount", errorHandling(async (req, res) => {
    const donCount = await Donation.countDocuments()
    res.json(donCount)
}))




router.get("/donationTotals", errorHandling(async (req, res) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const results = await Donation.aggregate([
    {
      $addFields: {
        numericAmount: { $toDouble: "$amount" },
        donationYear: { $year: "$date" },
        donationMonth: { $month: "$date" }
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
        yearly: [ // New yearly aggregation
          {
            $match: {
              $expr: { $eq: ["$donationYear", currentYear] }
            }
          },
          { $group: { _id: null, total: { $sum: "$numericAmount" } } }
        ],
        overall: [ // Keep this if you still want all-time total
          { $group: { _id: null, total: { $sum: "$numericAmount" } } }
        ]
      }
    }
  ]);

  res.json({
    monthlyTotal: results[0].monthly[0]?.total || 0,
    yearlyTotal: results[0].yearly[0]?.total || 0, // New field
    overallTotal: results[0].overall[0]?.total || 0 // Optional
  });
}));




export default router;
