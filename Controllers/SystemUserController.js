import express from "express"
import errorHandling from "../Middlewares/ErrorHandling.js";
import SystemUser from "../Modules/SystemUser.js";
import bcrypt from "bcryptjs"
import upload from "../Middlewares/ImageFilter.js"
import cloudinary from "../Cloudinary.js"
const router = express.Router()

const adminUser = async () => {
  const [adminName, adminEmail, adminPassword, adminContact, adminCnic] = [
    "Admin",
    "dmsadmin@gmail.com",
    "1234",
    "03001234567", 
    "35202-1234567-1" 
  ];

  const checkAdmin = await SystemUser.findOne({ email: adminEmail });
  if (checkAdmin) return null;

  const hashAdminPassword = await bcrypt.hash(adminPassword, 10);

  await SystemUser.create({
    name: adminName,
    email: adminEmail,
    contact: adminContact,
    cnic: adminCnic,
    password: hashAdminPassword,
    roleId: "Admin", 
    img: "" 
  });
};

adminUser();


router.post("/addUser", upload.single("img"), errorHandling(async (req, res) => {
    const { name, email, password, confirmPassword, contact,cnic, roleId } = req.body
    if (!name || !email || !password || !confirmPassword || !contact || !cnic || !roleId) return res.status(400).json({ message: "Please fill the required fields" })

    const [checkEmail, checkNumber] = await Promise.all([
        SystemUser.findOne({ email }),
        SystemUser.findOne({ contact })
    ])
    if (checkEmail) return res.status(400).json({ message: "Email already exists" })
    if (checkNumber) return res.status(400).json({ message: "Number already exists" })
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match" })

    let img_url;
    if (req.file) {
        const uploadImage = await cloudinary.uploader.upload(req.file.path)
        img_url = uploadImage.secure_url
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await SystemUser.create({ name, email, password: hashedPassword, img: img_url, contact, cnic, roleId })
    res.json(newUser)
}))


router.put("/EditUserById/:id", upload.single("img"), errorHandling(async (req, res) => {
    const { name, email, contact, cnic, roleId } = req.body;

    // Simplified validation - removed password fields
    if (!name || !email || !contact || !cnic || !roleId) {
        return res.status(400).json({ message: "Please fill the required fields" });
    }

    // Check if contact number is being used by another user (excluding current user)
    const existingUserWithContact = await SystemUser.findOne({ 
        contact,
        _id: { $ne: req.params.id } // Exclude current user from check
    });

    if (existingUserWithContact) {
        return res.status(400).json({ message: "Contact number already in use by another user" });
    }

    let img_url;
    if (req.file) {
        const uploadImage = await cloudinary.uploader.upload(req.file.path);
        img_url = uploadImage.secure_url;
    }

    const updateData = {
        name,
        contact,
        cnic,
        roleId,
        ...(img_url && { img: img_url }) // Only update image if new one was uploaded
    };

    const updatedUser = await SystemUser.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
    );

    res.json(updatedUser);
}));


router.post("/signIn", errorHandling(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" })
    const checkUser = await SystemUser.findOne({ email })
    if (!checkUser) return res.status(400).json({ message: "Email did not match" })

    const checkPassword = await bcrypt.compare(password, checkUser.password)
    if (!checkPassword) return res.status(400).json({ message: "Incorrect Password" })
    res.json(checkUser)
}))

router.get("/getUser", errorHandling(async (req, res) => {
    const allUsers = await SystemUser.find().populate("roleId")
    res.json(allUsers)
})) 


router.get("/getUserById/:id", errorHandling(async (req, res) => {
    const getUserById = await SystemUser.findById(req.params.id).populate("roleId", "role")
    if (!getUserById) return res.status(400).json({ message: "User not found" })
    res.json(getUserById)
}))



router.delete("/delUser/:id", errorHandling(async (req, res) => {
    const delUserById = await SystemUser.findByIdAndDelete(req.params.id)
    if (!delUserById) return res.status(400).json({ message: "User not found" })
    res.json("user successfully deleted")
}))





export default router;