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

router.get("/getZoneById/:id", errorHandling (async (req, res) => {
    const ZonebyId = await Zone.findById(req.params.id);
    if (!ZonebyId){
       return res.status(404).json({message: "Zone not found"}) 
    }
    res.json(ZonebyId);
}))

router.put("/updateZone/:id", errorHandling (async (req, res) => {
    const {zname} = req.body;
    const newZone = {};
    if (zname) {
        newZone.zname = zname
    }

    let updateZone = await Zone.findById(req.params.id);
    if (!updateZone) {
        return res.status(404).json({message: "Zone not found"});
    }
    updateZone = await Zone.findByIdAndUpdate (req.params.id, 
        {$set: newZone},
    {new: true});
    res.json(updateZone);
}))

router.delete("/delZone/:id", errorHandling (async (req, res) => {
    const deleteZone = await Zone.findByIdAndDelete(req.params.id);
    if (!deleteZone) return res.status(404).json({message: "Zone not found"});
    res.json({message: "Zone deleted successfully"})
}))

export default router;