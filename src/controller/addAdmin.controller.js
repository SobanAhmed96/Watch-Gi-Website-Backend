import { AddAdmin } from "../model/addAdmin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const addAdminController = {
  // Register Admin
  AddAdmin: asyncHandler(async (req, res) => {
    const { fullname, email, password, number } = req.body;

    if (!fullname || !email || !password || !number) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await AddAdmin.findOne({ email });
    const token = existingAdmin.generateToken()
    
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const newAdmin = await AddAdmin.create({
      fullname,
      email,
      password,
      number,
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        id: newAdmin._id,
        fullname: newAdmin.fullname,
        email: newAdmin.email,
        number: newAdmin.number,
        token
      },
    });
  }),

  // Login Admin
  LoginAdmin: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await AddAdmin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = admin.generateToken();

    res.cookie("token", token, {
       httpOnly: true,
       secure: true, // Important for HTTPS on Vercel
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
      },
    });
  }),

  // Check Login Status
  isLogin: asyncHandler(async (req, res) => {
    const token = req.cookies.token;
console.log(token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await AddAdmin.findById(decoded.id).select("-password");

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.status(200).json({
        success: true,
        message: "Authenticated",
        admin,
      });
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }),
};

export default addAdminController;
