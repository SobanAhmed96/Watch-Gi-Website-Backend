import { Product } from "../model/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadCloudinary from "../utils/cloudinary.js";

const productController = {
  addProduct: asyncHandler(async (req, res) => {
    const { title, price, description, links, category } = req.body;
    const imageProduct = req.file;

    // 1. Validation
    if (!title || !price || !description || !category || !imageProduct) {
      return res.status(400).json({
        success: false,
        message: "All fields including image and category are required",
      });
    }

    // 2. Upload image to Cloudinary
    const upload = await uploadCloudinary(imageProduct.path);

    if (!upload?.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
      });
    }

    // 3. Create product with image & category
    const newProduct = await Product.create({
      title,
      price,
      description,
      productImage: upload.secure_url,
      links,
      category,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  }),

  getProduct: asyncHandler(async (req, res) => {
    const productData = await Product.find();

    if (!productData || productData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products: productData,
    });
  }),

  getByIDProduct: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const productData = await Product.findById(id);

    if (!productData) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      productData,
    });
  }),

  editProduct: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, price, description, links, category } = req.body;
    const imageProduct = req.file;

    if (!title || !price || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, price, description and category are required.",
      });
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    let imageUrl = existingProduct.productImage;
    if (imageProduct) {
      const upload = await uploadCloudinary(imageProduct.path);
      if (!upload?.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed.",
        });
      }
      imageUrl = upload.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        price,
        description,
        links,
        category,
        productImage: imageUrl,
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
        message: "Product ID is required",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }),
};

export default productController;
