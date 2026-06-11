const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const Product = require("./models/Product");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Root route - serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// POST: Add new product
app.post("/api/products", async (req, res) => {
  const { name, price, quantity } = req.body;
  const numPrice = Number(price);
  const numQuantity = Number(quantity);

  if (!name || name.trim() === "" || isNaN(numPrice) || numPrice <= 0 || isNaN(numQuantity) || numQuantity <= 0) {
    return res.status(400).json({ error: "Invalid product name, price, or quantity" });
  }

  const total = numPrice * numQuantity;

  try {
    const newProduct = new Product({ 
      name: name.trim(), 
      price: numPrice, 
      quantity: numQuantity, 
      total 
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Product save failed" });
  }
});

// GET: Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// PUT: Update product (edit)
app.put("/api/products/:id", async (req, res) => {
  const { name, price, quantity } = req.body;
  const numPrice = Number(price);
  const numQuantity = Number(quantity);

  if (price !== undefined && (isNaN(numPrice) || numPrice <= 0)) {
    return res.status(400).json({ error: "Invalid price value" });
  }
  if (quantity !== undefined && (isNaN(numQuantity) || numQuantity <= 0)) {
    return res.status(400).json({ error: "Invalid quantity value" });
  }

  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updatedFields = {};
    if (name !== undefined) updatedFields.name = name.trim();
    if (price !== undefined) updatedFields.price = numPrice;
    if (quantity !== undefined) updatedFields.quantity = numQuantity;

    // Recalculate total if price or quantity has been updated
    if (price !== undefined || quantity !== undefined) {
      const p = price !== undefined ? numPrice : existing.price;
      const q = quantity !== undefined ? numQuantity : existing.quantity;
      updatedFields.total = p * q;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// PUT: Sell product (mark sold)
app.put("/api/products/:id/sell", async (req, res) => {
  const { sellNote } = req.body;

  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (existing.sold) {
      return res.status(400).json({ error: "Product is already marked sold" });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, {
      sold: true,
      sellDate: new Date(),
      sellNote: sellNote ? sellNote.trim() : ""
    }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Sell failed" });
  }
});

// DELETE: Delete product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully", deleted });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});