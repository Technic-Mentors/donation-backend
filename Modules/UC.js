import mongoose from "mongoose";
const { Schema } = mongoose;

const UCSchema = new Schema ({
    uname: {
        type: String,
        required: true,
    }
})

export default mongoose.model("UC", UCSchema)