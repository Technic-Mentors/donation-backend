import express from "express"
import errorHandling from "../Middlewares/ErrorHandling.js";
import User from "../Modules/User.js";
import bcrypt from "bcryptjs"
import upload from "../Middlewares/ImageFilter.js"
import cloudinary from "../Cloudinary.js"
const router = express.Router()

router.post("/addDonor", errorHandling (async (req, res) => {
    const {name, address, contact, districtId, zoneId, ucId} = req.body 
    if(!name || !contact || !districtId || !zoneId || !ucId) return res.status(400).json({
        message: "Please enter complete information"
    })

    const [checkContact] = await Promise.all([
        User.findOne({contact})
    ])
    if(checkContact) return res.status(400).json({message: "User with this contact already exists."})
     
    const newUser = await User.create({name, contact, address, districtId, zoneId, ucId})
    res.json(newUser)
}))

router.get("/getDonors", errorHandling (async (req, res) => {
   const allDonors = await User.find({}).populate("districtId").populate("zoneId").populate("ucId")
   res.json(allDonors)
}))

router.get("/getDonorByContact/:contact", errorHandling(async (req, res) => {
    const contact = req.params.contact;

    const donor = await User.findOne({ contact })
        .populate("districtId")
        .populate("zoneId")
        .populate("ucId");

    if (!donor) {
        return res.status(404).json({ message: "Donor not found" });
    }

    res.json(donor);
}));


router.get("/getDonorById/:id", errorHandling(async (req, res) => {
    const { id } = req.params;

    const donor = await User.findById(id)
        .populate("districtId")
        .populate("zoneId")
        .populate("ucId");

    if (!donor) {
        return res.status(404).json({ message: "Donor not found" });
    }

    res.json(donor);
}));


router.put("/updateDonor/:id", errorHandling(async (req, res) => {
    const { name, address, contact, districtId, zoneId, ucId } = req.body;
    const { id } = req.params;

    if (!name || !contact || !districtId || !zoneId || !ucId) {
        return res.status(400).json({
            message: "Please enter complete information"
        });
    }

    const existingDonor = await User.findById(id);
    if (!existingDonor) {
        return res.status(404).json({
            message: "Donor not found"
        });
    }

    const contactExists = await User.findOne({ contact, _id: { $ne: id } });
    if (contactExists) {
        return res.status(400).json({
            message: "Another donor with this contact already exists."
        });
    }

    existingDonor.name = name;
    existingDonor.address = address;
    existingDonor.contact = contact;
    existingDonor.districtId = districtId;
    existingDonor.zoneId = zoneId;
    existingDonor.ucId = ucId;

    const updatedDonor = await existingDonor.save();
    res.json(updatedDonor);
}));


router.delete("/delDonor/:id", errorHandling(async (req, res) => {
    const deleteDonor = await User.findByIdAndDelete(req.params.id)
    if(!deleteDonor) return res.status(404).json({message: "Donor not found"})
    res.json({message: "Donor deleted successfully"})
}))

export default router
