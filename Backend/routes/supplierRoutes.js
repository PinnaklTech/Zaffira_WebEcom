const express = require("express");
const Supplier = require("../models/Supplier");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/suppliers
// @desc Create a new supplier
// @access Private/ Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      emailId,
      certification,
      location,
      specialty,
    } = req.body;

    const supplier = new Supplier({
      name,
      phoneNumber,
      emailId,
      certification,
      location,
      specialty,
      user: req.user._id,
    });

    const createdSupplier = await supplier.save();
    res.status(201).json(createdSupplier);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error!");
  }
});

// @route GET /api/suppliers
// @desc Get all suppliers
// @access Public
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find({}).populate('user', 'name email');
    res.json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error!");
  }
});

// @route GET /api/suppliers/:id
// @desc Get supplier by ID
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).populate('user', 'name email');
    
    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404).json({ message: "Supplier Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error!");
  }
});

// @route PUT /api/suppliers/:id
// @desc Update an existing supplier using ID
// @access Private/ Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      emailId,
      certification,
      location,
      specialty,
    } = req.body;

    const supplier = await Supplier.findById(req.params.id);

    if (supplier) {
      // Update supplier fields (with undefined check)
      if (name !== undefined) supplier.name = name;
      if (phoneNumber !== undefined) supplier.phoneNumber = phoneNumber;
      if (emailId !== undefined) supplier.emailId = emailId;
      if (certification !== undefined) supplier.certification = certification;
      if (location !== undefined) supplier.location = location;
      if (specialty !== undefined) supplier.specialty = specialty;

      const updatedSupplier = await supplier.save();
      res.json(updatedSupplier);
    } else {
      res.status(404).json({ message: "Supplier Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route DELETE /api/suppliers/:id
// @desc Delete an existing supplier using ID
// @access Private/ Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (supplier) {
      await supplier.deleteOne();
      res.json({ message: "Supplier Removed!" });
    } else {
      res.status(404).json({ message: "Supplier Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router; 