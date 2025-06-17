import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnection from "./src/db/db.js";
import router from "./src/router/router.js";
const app = express();

// ✅ Middleware
app.use(cors({
  origin: "https://watch-gi.vercel.app",
  credentials: true,  
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// ✅ Routes
app.use("/api/v1", router);

// ✅ Root route
app.get("/", (req, res) => {
  res.json("✅ Welcome to Watch G Admin Dashboard Backend");
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;

dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB Connection Error:", error);
  });
