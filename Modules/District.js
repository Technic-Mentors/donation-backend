import mongoose from "mongoose";
const { Schema } = mongoose;

const DistrictSchema = new Schema ({
    district: {
        type: String,
        required: true,
    }
})

export default mongoose.model("District", DistrictSchema)