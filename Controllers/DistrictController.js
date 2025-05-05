import express from "express"
import District from "../Modules/District.js";
import errorHandling from "../Middlewares/ErrorHandling.js"

const router = express.Router();

router.post("/addDist", errorHandling(async (req, res) => {
    const { district } = req.body
    const allDistrict = await District.create({
        district,
    });
    res.json(allDistrict)
}));

router.get("/getAllDist", errorHandling (async (req, res) => {
    const getDist = await District.find({});
    res.json(getDist);
}))

export default router;