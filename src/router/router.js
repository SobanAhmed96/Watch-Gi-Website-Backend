import express from "express";
import addAdminController from "../controller/addAdmin.controller.js";
import { upload } from "../middleware/upload.js";
import productController from "../controller/product.controller.js";

const router = express.Router();

router.route("/addAdmin").post(addAdminController.AddAdmin);
router.route("/loginAdmin").post(addAdminController.LoginAdmin);
router.route("/isLogin").get(addAdminController.isLogin);

// Product

router.route("/addProduct").post(upload.array("productImages", 4), productController.addProduct)
router.route("/getProduct").get(productController.getProduct)
router.route("/getByIdProduct/:id").get(productController.getByIDProduct)
router.route("/updateProduct/:id").put(upload.array("productImages", 4), productController.editProduct);
router.route("/deleteProduct/:id").delete(productController.deleteProduct)


export default router;