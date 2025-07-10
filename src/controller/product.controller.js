import { Product } from "../model/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadCloudinary from "../utils/cloudinary.js";
import fs from "fs";

const productController = {
  addProduct: asyncHandler(async (req, res) => {
    const { title, price, description, links, category } = req.body;
    const files = req.files;

    // Validate required fields
    if (!title || !price || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, price, description, and category are required.",
      });
    }

    // Validate required image (productImage)
    if (!files || !files.productImage) {
      return res.status(400).json({
        success: false,
        message: "Front image (productImage) is required.",
      });
    }

    // Upload images to Cloudinary
    const imageUrls = {};

    for (const key of ["productImage", "productImageBack", "productImageLeft", "productImageRight"]) {
      if (files[key] && files[key][0]) {
        const upload = await uploadCloudinary(files[key][0].path);

        if (!upload?.secure_url) {
          return res.status(500).json({
            success: false,
            message: `Failed to upload ${key}.`,
          });
        }

        imageUrls[key] = upload.secure_url;

        // Delete local file
        fs.unlinkSync(files[key][0].path);
      }
    }

    // Create product
    const newProduct = await Product.create({
      title,
      price,
      description,
      links,
      category,
      productImage: imageUrls.productImage,
      productImageBack: imageUrls.productImageBack,
      productImageLeft: imageUrls.productImageLeft,
      productImageRight: imageUrls.productImageRight,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: newProduct,
    });
  }),

  getProduct: asyncHandler(async (req, res) => {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      products,
    });
  }),

  getByIDProduct: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully.",
      product,
    });
  }),

  editProduct: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, price, description, links, category } = req.body;
    const files = req.files;

    // Validate fields
    if (!title || !price || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, price, description, and category are required.",
      });
    }

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Upload new images if provided
    const imageUrls = {};

    for (const key of ["productImage", "productImageBack", "productImageLeft", "productImageRight"]) {
      if (files[key] && files[key][0]) {
        const upload = await uploadCloudinary(files[key][0].path);

        if (!upload?.secure_url) {
          return res.status(500).json({
            success: false,
            message: `Failed to upload ${key}.`,
          });
        }

        imageUrls[key] = upload.secure_url;

        // Delete local file
        fs.unlinkSync(files[key][0].path);
      }
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        price,
        description,
        links,
        category,
        ...imageUrls,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  }),

  deleteProduct: asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  }),
};

export default productController;
