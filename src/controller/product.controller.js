import { Product } from "../model/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadCloudinary from "../utils/cloudinary.js";

const productController = {
  // Create product
  addProduct: asyncHandler(async (req, res) => {
    const { title, price, description, links, category } = req.body;
    const files = req.files;

    if (!title || !price || !description || !category || !files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All fields and at least one image are required.",
      });
    }

    // Upload images to Cloudinary
    const uploads = await Promise.all(files.map(file => uploadCloudinary(file.path)));

    if (uploads.some(result => !result || !result.secure_url)) {
      return res.status(500).json({
        success: false,
        message: "One or more images failed to upload to Cloudinary.",
      });
    }

    const newProduct = await Product.create({
      title,
      price,
      description,
      productImage: uploads[0]?.secure_url || "",
      productImage2: uploads[1]?.secure_url || "",
      productImage3: uploads[2]?.secure_url || "",
      productImage4: uploads[3]?.secure_url || "",
      links,
      category,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: newProduct,
    });
  }),

  // Get all products
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

  // Get product by ID
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

  // Edit product
  editProduct: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, price, description, links, category } = req.body;
    const files = req.files;

    if (!title || !price || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, price, description, and category are required.",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Keep existing images as default
    let updatedImages = {
      productImage: product.productImage,
      productImage2: product.productImage2,
      productImage3: product.productImage3,
      productImage4: product.productImage4,
    };

    if (files && files.length > 0) {
      const uploads = await Promise.all(files.map(file => uploadCloudinary(file.path)));

      if (uploads.some(result => !result || !result.secure_url)) {
        return res.status(500).json({
          success: false,
          message: "One or more images failed to upload to Cloudinary.",
        });
      }

      // Update each image slot only if new image is uploaded
      if (uploads[0]?.secure_url) updatedImages.productImage = uploads[0].secure_url;
      if (uploads[1]?.secure_url) updatedImages.productImage2 = uploads[1].secure_url;
      if (uploads[2]?.secure_url) updatedImages.productImage3 = uploads[2].secure_url;
      if (uploads[3]?.secure_url) updatedImages.productImage4 = uploads[3].secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        price,
        description,
        links,
        category,
        ...updatedImages,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  }),

  // Delete product
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
