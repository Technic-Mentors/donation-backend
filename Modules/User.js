import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    districtId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "District"
    },
    zoneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Zone"
    },
    ucId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UC"
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
