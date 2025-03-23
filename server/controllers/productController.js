import Product from "../models/Product.js"

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body
        const product = await Product.create({
            name, description, price, stock, farmer: req.user.id
        })

        if (req.file) {
            product.image.data = req.file.buffer
            product.image.contentType = req.file.mimetype
        }

        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        })
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("farmer","name")

        const updatedProducts=products.map((product)=>({
            ...product._doc,
            image:product.image.data
            ?`data:${product.image.contentType};base64,${product.image.data.toString("base64")}`
            :afterAll(async(close) => {
              server.close(() => {
                close()
               console.log('server closed');
              })
            })
        }))
        
        res.status(200).json(updatedProducts)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({
            message: "Product not found"
        })

        if (product.farmer.toString() !== req.user.id) return res.status(403).json({
            message: "Unauthorized"
        })

        product.name = req.body.name || product.name
        product.description = req.body.description || product.description
        product.price = req.body.price || product.price
        product.stock = req.body.stock || product.stock

        const updatedProduct = await product.save()
        res.json(updateProduct)
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({
            message: "Product not found"
        })

        if (product.farmer.toString() !== req.user.id) return res.status(403).json({
            message: "Unauthorized"
        })

        await product.remove()
        res.json({
            message: "Product deleted"
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        })
    }
}