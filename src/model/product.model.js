import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    productImage: {
      type: String,
      required: [true, "Product image URL is required"],
    },
    productImage2: {
      type: String,
      required: [true, "Product image URL is required"],
    },
    productImage3: {
      type: String,
      required: [true, "Product image URL is required"],
    },
    productImage4: {
      type: String,
    },
    links: {
      type: String,
    },
    category: {
      type: String,
      enum: ["Men", "Women", "Children"],
      required: [true, "Category is required"],
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
