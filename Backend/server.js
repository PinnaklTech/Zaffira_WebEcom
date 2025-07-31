const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes= require("./routes/cartRoutes");
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminAppointmentroutes = require("./routes/adminAppointmentRoutes");
const consultationRoutes = require('./routes/consultationRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connecting to MongoDB
connectDB()

app.get("/", (req, res) => {
  res.send("Welcome to Zaffira");
});







// API Routes {User / login / register / profile}
app.use("/api/users", userRoutes);

// API Routes {Products / get all/ delete/ add/ modify / create}
app.use("/api/products", productRoutes);

//API Routes {Cart / }
app.use("/api/cart", cartRoutes);


//API Routes {Appointment / }
app.use("/api/appointments", appointmentRoutes);


//API Routes {Consultations}
app.use('/api/consultations', consultationRoutes);

//API Routes {Suppliers}
app.use('/api/suppliers', supplierRoutes);

//API Router
app.use("/api/admin/users", adminRoutes);

//API ROUTES
app.use("/api/admin/products", productAdminRoutes);

//API  ROUTES
app.use("/api/admin/appointments",adminAppointmentroutes);


// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });



app.listen(PORT, '0.0.0.0', () => {
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  const lanIp = Object.values(networkInterfaces)
    .flat()
    .find((iface) => iface.family === 'IPv4' && !iface.internal)?.address;

  console.log(`Server running on:`);
  console.log(` ➜ Local:   http://localhost:${PORT}`);
  console.log(` ➜ Network: http://${lanIp}:${PORT}`);
});
