import express from "express"
import errorHandling from "../Middlewares/ErrorHandling.js";
import User from "../Modules/User.js";
import bcrypt from "bcryptjs"
import upload from "../Middlewares/ImageFilter.js"
import cloudinary from "../Cloudinary.js"
const router = express.Router()
// const adminUser = async () => {
//     const [adminName, adminEmail, adminPassword, adminNumber] = ["Admin", "mailto:donationadmin@gmail.com", "1234", "admin Number"]
//     const checkAdmin = await User.findOne({ email: adminEmail })
//     if (checkAdmin) return null;
//     const hashAdminPassword = await bcrypt.hash(adminPassword, 10)
//     await User.create({
//         name: adminName,
//         email: adminEmail,
//         password: hashAdminPassword,
//         number: adminNumber,
//         role: "Admin"
//     })
// }

// adminUser()

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


export default router
