import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true, // whose order is this
    },
    symbol: {
      type: String,
      required: true, // which stock e.g. "AAPL"
    },
    qty: {
      type: Number,
      required: true, // how many shares
    },
    price: {
      type: Number,
      required: true, // at what price
    },
    side: {
      type: String,
      enum: ["buy", "sell"], // only these two values allowed
      required: true,
    },
    status: {
      type: String,
      enum: ["queued", "filled", "failed"],
      default: "queued",
    },
  },
  {
    timestamps: true,
  },
);

export const Order = mongoose.model("Order", orderSchema);
