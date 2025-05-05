import mongoose from "mongoose";

const { Schema } = mongoose;

const DonationSchema = new Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  donationType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DonationType",
    required: true,
  },
  remarks: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // In case you later store who received the donation
    required: false,
  },
});

export default mongoose.model("Donation", DonationSchema);
