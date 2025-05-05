import mongoose from "mongoose";
const { Schema } = mongoose;

const donationTypeSchema = new Schema ({
    dontype: {
        type: String,
        required: true,
    }
})

export default mongoose.model ("DonationType", donationTypeSchema)