import express from "express";
import mongoose from "mongoose";
import Donation from "../Modules/Donation.js"; 
import errorHandling from "../Middlewares/ErrorHandling.js"

const router = express.Router()

router.get("/donations", errorHandling(async (req, res) => {
  const {
    startDate,
    endDate,
    donationTypeId,
    donorId,
    donorName,
    districtId,
    zoneId,
    ucId
  } = req.query;

  const query = {};

  // 1. Date Range Filter
  if (startDate && endDate) {
    const from = new Date(startDate);
    from.setHours(0, 0, 0, 0);
    const to = new Date(endDate);
    to.setHours(23, 59, 59, 999);
    query.date = { $gte: from, $lte: to };
  } 

  // 2. Donation Type

const donateTypeId = req.query.donationType;
if (donateTypeId) {
  query.donationType = new mongoose.Types.ObjectId(donateTypeId);
}

  // 3. Donor by ID
  if (donorId) {
    query.donor = donorId;
  }

  // 4. Donor sub-filters (district, zone, uc, name)
  const donorMatch = {};

  if (donorName) {
    donorMatch.name = { $regex: `^${donorName}$`, $options: "i" }; // exact match (case-insensitive)
  }

  if (districtId) donorMatch.districtId = districtId;
  if (zoneId) donorMatch.zoneId = zoneId;
  if (ucId) donorMatch.ucId = ucId;

  const donations = await Donation.find(query)
    .populate({
      path: "donor",
      match: donorMatch,
      select: "name contact address",
      populate: [
        { path: "districtId", select: "district" },
        { path: "zoneId", select: "zname" },
        { path: "ucId", select: "uname" },
      ],
    })
    .populate("donationType", "dontype");

  // Filter out donations where donor didn't match
  const filteredDonations = donations.filter(d => d.donor !== null);

  res.json(filteredDonations);
}));



router.get("/donations-by-date", errorHandling(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Start date and end date are required" });
  }

  const donations = await Donation.find({
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  })
    .populate({
      path: "donor",
      select: "name contact address",
      populate: [
        { path: "districtId", select: "district" },
        { path: "zoneId", select: "zname" },
        { path: "ucId", select: "uname" },
      ],
    })
    .populate("donationType", "dontype");

  res.json(donations);
}));


router.get("/donations-by-donation-type", errorHandling(async (req, res) => {
  const { donationTypeId } = req.query;

  if (!donationTypeId) {
    return res.status(400).json({ message: "Donation type is required" });
  }

  const donations = await Donation.find({ donationType: donationTypeId })
    .populate({
      path: "donor",
      select: "name contact address",
      populate: [
        { path: "districtId", select: "district" },
        { path: "zoneId", select: "zname" },
        { path: "ucId", select: "uname" },
      ],
    })
    .populate("donationType", "dontype");

  res.json(donations);
}));


router.get("/donations-by-donor", errorHandling(async (req, res) => {
  const { donorId } = req.query;

  if (!donorId) {
    return res.status(400).json({ message: "Donor is required" });
  }

  const donations = await Donation.find({ donor: donorId })
    .populate({
      path: "donor",
      select: "name contact address",
      populate: [
        { path: "districtId", select: "district" },
        { path: "zoneId", select: "zname" },
        { path: "ucId", select: "uname" },
      ],
    })
    .populate("donationType", "dontype");

  res.json(donations);
}));



router.get("/donations-by-district", errorHandling(async (req, res) => {
  const { districtId } = req.query;

  if (!districtId) {
    return res.status(400).json({ message: "District is required" });
  }

  const donations = await Donation.find()
    .populate({
      path: "donor",
      match: { districtId }, 
      select: "name contact address districtId zoneId ucId",
      populate: [
        { path: "districtId", select: "district" },
        { path: "zoneId", select: "zname" },
        { path: "ucId", select: "uname" },
      ],
    })
    .populate("donationType", "dontype");

  // Filter out donations where the donor is null (didn’t match districtId)
  const filtered = donations.filter(d => d.donor !== null);

  res.json(filtered);
}));



router.get("/donations-by-zone", errorHandling(async (req, res) => {
  const { zoneId } = req.query;

  if (!zoneId) {
    return res.status(400).json({ message: "Zone is required" });
  }

  const donations = await Donation.find({ "donor.zoneId": zoneId })
    .populate({
      path: "donor",
      select: "name contact address",
      populate: [
        { path: "districtId", select: "district" },
        { path: "zoneId", select: "zname" },
        { path: "ucId", select: "uname" },
      ],
    })
    .populate("donationType", "dontype");

  res.json(donations);
}));



router.get("/donations-by-uc", errorHandling(async (req, res) => {
  const { ucId } = req.query;

  if (!ucId) {
    return res.status(400).json({ message: "UC is required" });
  }

  const donations = await Donation.find({ "donor.ucId": ucId })
    .populate({
      path: "donor",
      select: "name contact address",
      populate: [
        { path: "districtId", select: "district" },
        { path: "zoneId", select: "zname" },
        { path: "ucId", select: "uname" },
      ],
    })
    .populate("donationType", "dontype");

  res.json(donations);
}));


export default router;