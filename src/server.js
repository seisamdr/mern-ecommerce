import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// load .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/inventories", inventoryRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/carts", cartRoutes);
// app.use("/api/invoice", invoiceRoutes);
// app.use("/api/statistik", statistikRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
