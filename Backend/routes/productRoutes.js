const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/products
// @desc Create a new product
// @access Private/ Admin

router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      collections,
      images,
      isFeatured,
      isPublished,
      tags,
      sku,
      supplier,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      collections,
      images,
      isFeatured,
      isPublished,
      tags,
      sku,
      supplier,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error!");
  }
});

//@route PUT /api/product/:ID
// @desc Update An existing product  using ID
// @access Private/ Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      collections,
      images,
      isFeatured,
      isPublished,
      tags,
      sku,
      supplier,
    } = req.body;

    // ✅ Correct usage of Product model
    const product = await Product.findById(req.params.id);

    if (product) {
      // Update product fields (with undefined check)
      if (name !== undefined) product.name = name;
      if (description !== undefined) product.description = description;
      if (price !== undefined) product.price = price;
      if (discountPrice !== undefined) product.discountPrice = discountPrice;
      if (countInStock !== undefined) product.countInStock = countInStock;
      if (category !== undefined) product.category = category;
      if (collections !== undefined) product.collections = collections;
      if (images !== undefined) product.images = images;
      if (isFeatured !== undefined) product.isFeatured = isFeatured;
      if (isPublished !== undefined) product.isPublished = isPublished;
      if (tags !== undefined) product.tags = tags;
      if (sku !== undefined) product.sku = sku;
      if (supplier !== undefined) product.supplier = supplier;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

////@route Delete /api/product/:ID
// @desc Delete An existing product  using ID
// @access Private/ Admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    // Find the product using ID
    const product = await Product.findById(req.params.id);

    if (product) {
      // remove the product from DB
      await product.deleteOne();
      res.json({ message: " Product Removed!" });
    } else {
      res.status(404).json({ message: "Prodcut Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route GET /api/products/:id
// @desc GET single product by ID
// @acess Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('supplier', 'name phoneNumber emailId location specialty certification')
      .populate('user', 'name email');
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error!");
  }
});

//@route GET /api/products
// @desc GET all products with optional query filters
// @acess Public

router.get("/", async (req, res) => {
  try {
    const { category, collections, minPrice, maxPrice, sortBy, limit } =
      req.query;
    let query = {};

    //filtering Logic
    if (collections) {
      const colVals = Array.isArray(collections) ? collections : collections.split(',');
      if (colVals.length === 1 && colVals[0].toLowerCase() === 'all') {
        // do nothing
      } else {
        query.collections = { $in: colVals };
      }
    }
    if (category) {
      const catVals = Array.isArray(category) ? category : category.split(',');
      if (catVals.length === 1 && catVals[0].toLowerCase() === 'all') {
        // do nothing
      } else {
        query.category = { $in: catVals };
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sort Logic
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
        case "price-low":
        case "price-low-high":
          sort = { price: 1 };
          break;
        case "priceDesc":
        case "price-high":
        case "price-high-low":
          sort = { price: -1 };
          break;
        case "popularity":
        case "rating":
          sort = { rating: -1 };
          break;
        case "newest":
          sort = { createdAt: -1 };
          break;
        case "name":
        case "name-a-z":
          sort = { name: 1 };
          break;
        default:
          break;
      }
    }

    //fetch products from DB
    let products = await Product.find(query)
      .populate('supplier', 'name phoneNumber emailId location specialty certification')
      .sort(sort)
      .limit(Number(limit) || 0);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;
