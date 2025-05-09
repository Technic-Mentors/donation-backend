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

router.get("/getDonTypeId/:id", errorHandling (async (req, res) => {
    const TypeById = await DonationType.findById(req.params.id);
    if (!TypeById){
       return res.status(404).json({message: "Donation Type not found"}) 
    }
    res.json(TypeById);
}))

router.put("/updateType/:id", errorHandling (async (req, res) => {
    const {dontype} = req.body;
    const newType = {};
    if (dontype) {
        newType.dontype = dontype
    }

    let updateType = await DonationType.findById(req.params.id);
    if (!updateType) {
        return res.status(404).json({message: "Donation Type not found"});
    }
    updateType = await DonationType.findByIdAndUpdate (req.params.id, 
        {$set: newType},
    {new: true});
    res.json(updateType);
}))

router.delete("/delType/:id", errorHandling (async (req, res) => {
    const deleteType = await DonationType.findByIdAndDelete(req.params.id);
    if (!deleteType) return res.status(404).json({message: "Donation Type not found"});
    res.json({message: "Donation Type deleted successfully"})
}))

export default router;