import express from "express"
import errorHandling from "../Middlewares/ErrorHandling.js"
import Role from "../Modules/Role.js";

const router = express.Router();

router.post("/addRole", errorHandling(async (req, res) => {
    const { role } = req.body
    const allRoles = await Role.create({
        role,
    });
    res.json(allRoles)
}));

router.get("/getAllRoles", errorHandling (async (req, res) => {
    const getRole = await Role.find({});
    res.json(getRole);
}))


router.get("/getRoleById/:id", errorHandling (async (req, res) => {
    const RoleById = await Role.findById(req.params.id);
    if (!RoleById){
       return res.status(404).json({message: "Role not found"}) 
    }
    res.json(RoleById);
}))

router.put("/updatRole/:id", errorHandling (async (req, res) => {
    const {role} = req.body;
    const newRole = {};
    if (role) {
        newRole.role = role
    }

    let updateRole = await Role.findById(req.params.id);
    if (!updateRole) {
        return res.status(404).json({message: "Role not found"});
    }
    updateRole = await Role.findByIdAndUpdate (req.params.id, 
        {$set: newRole},
    {new: true});
    res.json(updateRole);
}))

router.delete("/delRole/:id", errorHandling (async (req, res) => {
    const deleteRole = await Role.findByIdAndDelete(req.params.id);
    if (!deleteRole) return res.status(404).json({message: "Role not found"});
    res.json({message: "Role deleted successfully"})
}))

export default router;