const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    certification: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    specialty: {
        type: String,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Supplier", supplierSchema); 