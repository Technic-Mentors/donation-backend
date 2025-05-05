import express from "express"
import Zone from "../Modules/Zone.js";
import errorHandling from "../Middlewares/ErrorHandling.js"

const router = express.Router();

router.post("/addZone", errorHandling(async (req, res) => {
    const { zname } = req.body
    const allZone = await Zone.create({
        zname,
    });
    res.json(allZone)
}));

router.get("/getAllZone", errorHandling (async (req, res) => {
    const getZone = await Zone.find({});
    res.json(getZone);
}))

export default router;