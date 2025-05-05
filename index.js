import express from "express";
import mongoDbConnection from "./db.js";
import DonationTypeController from "./Controllers/DonationTypeController.js"
import UCController from "./Controllers/UCController.js"
import ZoneController from "./Controllers/ZoneController.js"
import DistrictController from "./Controllers/DistrictController.js"
import UserController from "./Controllers/UserController.js"
import DonationController from "./Controllers/DonationController.js"


import cors from "cors"  
mongoDbConnection() 
const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/dontype", DonationTypeController),
app.use("/api/UC", UCController),
app.use("/api/Zone", ZoneController),
app.use("/api/District", DistrictController),
app.use("/api/Donor", UserController),
app.use("/api/Donation", DonationController)

   
app.listen(8000,"0.0.0.0", () => {
    console.log("App listing at http://0.0.0.0:8000");
})
 