import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import { notifyPriceChange } from "../utils/notification.utils.js";

export const createProduct = async (req, res) => {
  try {
    const { name, pricePerkg, stock, isAvailable, productImage } = req.body;
    const owner = req.user;

    // Validate required fields
    if (!name || !pricePerkg || !stock || !productImage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (owner.role !== "farmer") {
      return res.status(403).json({ error: "Only Farmer can create products" });
    }
    // Create a new product
    const newProduct = new Product({
      owner,
      name,
      pricePerKg: pricePerkg,
      stock,
      isAvailable,
      productImage,
    });
    // Save the product to the database
    const savedProduct = await newProduct.save();
    // Send the saved product as a response
    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate(
      "owner",
      "firstname lastname profilePic role"
    );
    res
      .status(200)
      .json({ message: "Products fetched successfully", data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this product" });
    }
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { pricePerKg, stock, isAvailable } = req.body;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });
    }

    // Update fields
    if (stock !== undefined) product.stock = stock;
    if (isAvailable !== undefined) product.isAvailable = isAvailable;

    // If price changes, push to history
    if (pricePerKg !== undefined && pricePerKg !== product.pricePerKg) {
      product.priceHistory.push({ price: product.pricePerKg, date: Date.now() }); // Push OLD price to history, or new? usually track changes. Let's push existing price before update. 
      // Actually, standard is to have the history of *past* prices. The current price is in pricePerKg.
      // Or we can just log the new price. 
      // Let's log the *new* price with date.
      product.pricePerKg = pricePerKg;
      product.priceHistory.push({ price: pricePerKg, date: Date.now() });

      const oldPrice = parseFloat(product.pricePerKg);
      const newPrice = parseFloat(pricePerKg);

      console.log(`Price change detected for Product ${product._id}: ${oldPrice} -> ${newPrice}`);

      // Notify past buyers
      const orders = await Order.find({ product: product._id });
      const buyerIds = [...new Set(orders.map(order => order.buyer.toString()))];

      console.log(`Found ${orders.length} orders. Unique buyers to notify:`, buyerIds);

      // Verify we have buyers
      if (buyerIds && buyerIds.length > 0) {
        // Send notifications
        buyerIds.forEach(buyerId => {
          console.log(`Triggering notification for buyer: ${buyerId}`);
          notifyPriceChange(buyerId, product, oldPrice, newPrice);
        });
      }
    }

    const updatedProduct = await product.save();
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
