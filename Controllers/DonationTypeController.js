import express from "express"
import DonationType from "../Modules/DonationType.js";
import errorHandling from "../Middlewares/ErrorHandling.js"

const router = express.Router();

router.post("/addDonType", errorHandling(async (req, res) => {
    const { dontype } = req.body
    const allDonationTypes = await DonationType.create({
        dontype,
    });
    res.json(allDonationTypes)
}));

router.get("/getAllDonType", errorHandling (async (req, res) => {
    const getDonType = await DonationType.find({});
    res.json(getDonType);
}))

export default router;