require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const corsOptions = {
  origin: ["http://localhost:5173", "https://YOUR_FRONTEND_URL.vercel.app"],
  credentials: true,
};

const app = express();

connectDB();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
