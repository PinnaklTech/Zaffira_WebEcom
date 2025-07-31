const express = require("express");
const Appointment = require("../models/Appointment");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/appointments
// @desc Get all appointments (Admin Only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate("user", "name email")
      .populate({
        path: "cart",
        populate: {
          path: "products.productId",
          model: "Product",
          select: "name price",
        },
      })
      .sort({ createdAt: -1 }); // Sort by newest first



    // Transform the data to match frontend expectations
    const transformedAppointments = appointments.map(appointment => ({
      _id: appointment._id,
      id: appointment._id,
      appointment_date: appointment.appointment_date,
      status: appointment.status,
      notes: appointment.notes,
      total_amount: appointment.total_amount,
      cart_items: appointment.cart_items || [],
      customer_name: appointment.customer_name,
      customer_email: appointment.customer_email,
      customer_phone: appointment.customer_phone,
      user_id: appointment.user?._id || appointment.user,
      user: appointment.user, // Include the full user object for admin panel
      created_at: appointment.createdAt,
      updated_at: appointment.updatedAt
    }));

    res.json(transformedAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error!" });
  }
});

// @route PUT /api/admin/appointments/:id
// @desc Update the appointment status
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment Not Found" });
    }

    appointment.status = req.body.status || appointment.status;

    if (req.body.status === "confirmed" && !appointment.confirmedAt) {
      appointment.confirmedAt = new Date();
    }

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE /api/admin/appointments/:id
// @desc Delete the appointment
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment Not Found" });
    }

    await appointment.deleteOne();
    res.json({ message: "Appointment Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error!" });
  }
});

module.exports = router;
