import Product from "../models/Product.js"

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        const product = new Product({
            name,
            description,
            price,
            stock,
            farmer: req.user.id,
            category,
            status: "pending" // <-- Always set to pending for admin approval
        });

        if (req.file) {
            product.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        await product.save();
        res.status(201).json({
            message: "Product submitted for admin approval.",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};

export const getProducts = async (req, res) => {
    try {
      const products = await Product.find({ status: "approved" ,stock: { $gt: 0 } }) // Fetch only approved products with stock > 0
        .populate("farmer", "name")
        .lean(); // Important: convert Mongoose documents to plain JS objects
  
      const formattedProducts = products.map((product) => {
        return {
          ...product,
          id: product._id, // Keep product id if needed on frontend
          farmer: product.farmer?.name || "Unknown",
          _id: undefined, // Remove _id
          __v: undefined, // Remove __v if needed
        };
      });
  
      res.status(200).json(formattedProducts);
    } catch (error) {
      console.error("Error in getProducts:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  

export const getProductsById = async (req, res) => {
    try {
        const products = await Product.find({
            farmer: req.user.id,
        });

        // Convert image data to Base64 if it exists
        const updatedProducts = products.map((product) => {
            if (product.image && product.image.data) {
                return {
                    ...product._doc, // Spread the product document
                    image: {
                        data: product.image.data.toString("base64"), // Convert Buffer to Base64
                        contentType: product.image.contentType,
                    },
                };
            }
            return product;
        });

        return res.status(200).json({ products: updatedProducts });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({
            message: "Product not found"
        });

        if (product.farmer.toString() !== req.user.id) return res.status(403).json({
            message: "Unauthorized"
        });

        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.stock = req.body.stock || product.stock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({
            message: "Product not found"
        });

        if (product.farmer.toString() !== req.user.id) return res.status(403).json({
            message: "Unauthorized"
        });

        await product.remove();
        res.json({
            message: "Product deleted"
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};