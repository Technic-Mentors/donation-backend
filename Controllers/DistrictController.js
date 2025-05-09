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


router.get("/getDistById/:id", errorHandling (async (req, res) => {
    const DistById = await District.findById(req.params.id);
    if (!DistById){
       return res.status(404).json({message: "District not found"}) 
    }
    res.json(DistById);
}))

router.put("/updateDist/:id", errorHandling (async (req, res) => {
    const {district} = req.body;
    const newDist = {};
    if (district) {
        newDist.district = district
    }

    let updateDistrict = await District.findById(req.params.id);
    if (!updateDistrict) {
        return res.status(404).json({message: "District not found"});
    }
    updateDistrict = await District.findByIdAndUpdate (req.params.id, 
        {$set: newDist},
    {new: true});
    res.json(updateDistrict);
}))

router.delete("/delDist/:id", errorHandling (async (req, res) => {
    const deleteDist = await District.findByIdAndDelete(req.params.id);
    if (!deleteDist) return res.status(404).json({message: "District not found"});
    res.json({message: "District deleted successfully"})
}))

export default router;