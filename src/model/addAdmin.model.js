import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const addAdminSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    number: {
      type: String,
      required: [true, "Phone number is required"],
    },
  },
  { timestamps: true }
);

// Hash password before saving
addAdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare plain text password with hashed one
addAdminSchema.methods.comparePassword = async function (password) {
  
  return await bcrypt.compare(password, this.password);
};

// Generate JWT token
addAdminSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export const AddAdmin = mongoose.model("AddAdmin", addAdminSchema);
