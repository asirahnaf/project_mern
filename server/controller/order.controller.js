import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

export const createOrder = async (req, res) => {
  try {
    const { cartId, address, cartItemId } = req.body;
    const userId = req.user._id; // Authenticated user

    const user = await User.findById(userId);
    if (!user || user.role !== "buyer") {
      return res.status(403).json({ message: "Only buyers can create orders" });
    }

    const cart = await Cart.findById(cartId).populate("items.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const orders = [];

    // Determine items to process
    let itemsToProcess = [];

    if (cartItemId) {
      // Find specific item
      const itemIndex = cart.items.findIndex(
        (item) => item._id.toString() === cartItemId
      );

      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      itemsToProcess.push(cart.items[itemIndex]);
    } else {
      // Process all items
      itemsToProcess = cart.items;
    }

    if (itemsToProcess.length === 0) {
      return res.status(400).json({ message: "No items to process" });
    }

    for (const item of itemsToProcess) {
      const product = item.product;

      // Check availability again (safety)
      if (!product) {
        // Skip or error? If buying single item, error.
        if (cartItemId) return res.status(404).json({ message: "Product details missing" });
        continue;
      }

      if (!product.isAvailable || product.stock < item.quantityKg) {
        return res.status(400).json({
          message: `Product ${product.name} is not available or insufficient stock`,
        });
      }

      const totalPrice = product.pricePerKg * item.quantityKg;

      const newOrder = new Order({
        product: product._id,
        farmer: product.owner,
        buyer: userId,
        quantityKg: item.quantityKg,
        totalPrice,
        address,
        status: "pending",
      });

      await newOrder.save();

      // Update stock of the product
      product.stock -= item.quantityKg;
      await product.save();

      orders.push(newOrder);
    }

    // Remove processed items from cart
    if (cartItemId) {
      cart.items = cart.items.filter(
        (item) => item._id.toString() !== cartItemId
      );
    } else {
      cart.items = []; // Clear all
    }

    await cart.save();

    res.status(201).json({
      message: "Orders created successfully",
      data: cartItemId ? orders[0] : orders, // Return single order obj if single buy, else array
    });
  } catch (error) {
    console.error("Error creating orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let orders;

    if (userRole === "buyer") {
      orders = await Order.find({ buyer: userId })
        .populate("product")
        .populate("farmer", "firstname lastname username profilePic");
    } else if (userRole === "farmer") {
      orders = await Order.find({ farmer: userId })
        .populate("product")
        .populate("buyer", "firstname lastname username profilePic");
    } else {
      return res.status(403).json({ message: "Unauthorized user role" });
    }

    res.status(200).json({
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderByFarmer = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (userRole !== "farmer") {
      return res
        .status(403)
        .json({ message: "Only farmers can update orders" });
    }

    // Ensure status is one of the allowed values
    const validStatuses = [
      "pending",
      "accepted",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, farmer: userId },
      { status },
      { new: true }
    ).populate("product buyer", "name firstname lastname");

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ message: "Order not found or unauthorized" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
