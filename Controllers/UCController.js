import express from "express"
import UC from "../Modules/UC.js";
import errorHandling from "../Middlewares/ErrorHandling.js"

const router = express.Router();

router.post("/addUC", errorHandling(async (req, res) => {
    const { uname } = req.body
    const allUC = await UC.create({
        uname,
    });
    res.json(allUC)
}));

router.get("/getAllUC", errorHandling (async (req, res) => {
    const getUC = await UC.find({});
    res.json(getUC);
}))

export default router;