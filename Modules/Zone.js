import mongoose from "mongoose";
const { Schema } = mongoose;

const ZoneSchema = new Schema ({
    zname: {
        type: String,
        required: true,
    }
})

export default mongoose.model("Zone", ZoneSchema)