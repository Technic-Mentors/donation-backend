import mongoose from "mongoose";

const { Schema } = mongoose;

// First, create a counter schema for generating sequential receipt numbers
const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', CounterSchema);

const DonationSchema = new Schema({
  receiptNumber: {
    type: String,
    unique: true,
    index: true
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: String,
    required: true, 
  },
  paymentMode: {
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
    ref: "User",
    required: false,
  },
});

// Pre-save hook to generate receipt number
DonationSchema.pre('save', async function(next) {
  if (!this.receiptNumber) {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Gets last 2 digits of year
    
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'donationReceipt' }, // Identifier for our sequence
      { $inc: { seq: 1 } },      // Increment the sequence
      { new: true, upsert: true } // Create if doesn't exist
    );
    
    // Format: REC-YY-0001 (e.g. REC-24-0123)
    this.receiptNumber = `REC-${year}-${counter.seq.toString().padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model("Donation", DonationSchema);