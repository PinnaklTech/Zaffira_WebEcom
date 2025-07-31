const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  guestId: {
    type: String,
    required: false,
  },
  appointment_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "confirmed", "completed", "cancelled"],
  },
  notes: {
    type: String,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  cart_items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      name: String,
      image: String,
      price: Number,
      quantity: Number,
    }
  ],
  total_amount: {
    type: Number,
    required: true,
  },
  customer_name: String,
  customer_email: String,
  customer_phone: String,
  
  confirmedAt: {
    type: Date,
    default: null,
  },

  
}, {
  timestamps: true,
});

appointmentSchema.pre("validate", function (next) {
  if (!this.user && !(this.customer_name && this.customer_email && this.customer_phone)) {
    return next(new Error("Either user or complete customer info must be provided."));
  }
  next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);
