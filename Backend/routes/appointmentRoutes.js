const express = require("express");
const Appointment = require("../models/Appointment");
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/appointments
// @desc Create a new appointment from an existing cart
// @access Public or Private
router.post("/", async (req, res) => {
  const { userId, guestId, appointment_date, notes, customer_name, customer_email, customer_phone } = req.body;

  try {
    // Find Cart
    const cart = await Cart.findOne(userId ? { user: userId } : { guestId });
    


    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "No cart found or cart is empty" });
    }

    const appointment = new Appointment({
      user: userId || undefined,
      guestId: guestId || undefined,
      cart: cart._id,
      cart_items: cart.products, // snapshot of products at booking time
      appointment_date,
      notes,
      total_amount: cart.totalPrice,
      customer_name: userId ? undefined : customer_name,
      customer_email: userId ? undefined : customer_email,
      customer_phone: userId ? undefined : customer_phone,
    });



    await appointment.save();

    // Return the appointment with proper transformation
    const transformedAppointment = {
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
      user_id: appointment.user || userId,
      created_at: appointment.createdAt,
      updated_at: appointment.updatedAt
    };

    res.status(201).json(transformedAppointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/appointments/:id
// @desc Get appointment details with cart & products
// @access Private
router.get("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("cart")
      .populate("user", "name email");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/appointments
// @desc Get all appointments for the logged-in user
// @access Private
router.get("/", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("cart")
      .populate("user", "name email")
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
      created_at: appointment.createdAt,
      updated_at: appointment.updatedAt
    }));
    
    res.json(transformedAppointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
