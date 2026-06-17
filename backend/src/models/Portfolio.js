import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // one portfolio per user
    },
    cashBalance: {
      type: Number,
      default: 100000, // every new user starts with ₹1,00,000
    },
  },
  {
    timestamps: true,
  },
);

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
