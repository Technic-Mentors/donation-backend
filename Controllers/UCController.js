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

router.get("/getUCById/:id", errorHandling (async (req, res) => {
    const UCById = await UC.findById(req.params.id);
    if (!UCById){
       return res.status(404).json({message: "UC not found"}) 
    }
    res.json(UCById);
}))

router.put("/updateUC/:id", errorHandling (async (req, res) => {
    const {uname} = req.body;
    const newUC = {};
    if (uname) {
        newUC.uname = uname
    }

    let unionCouncil = await UC.findById(req.params.id);
    if (!unionCouncil) {
        return res.status(404).json({message: "Union Council not found"});
    }
    unionCouncil = await UC.findByIdAndUpdate (req.params.id, 
        {$set: newUC},
    {new: true});
    res.json(unionCouncil);
}))


router.delete("/delUC/:id", errorHandling (async (req, res) => {
    const deleteUC = await UC.findByIdAndDelete(req.params.id);
    if (!deleteUC) return res.status(404).json({message: "Union Council not found"});
    res.json({message: "Union Council deleted successfully"})
}))

export default router;