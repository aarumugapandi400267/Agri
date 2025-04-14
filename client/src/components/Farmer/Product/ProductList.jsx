import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, CardMedia, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box } from "@mui/material";
import { getProductsById, updateProductById, createProduct } from "../../../actions/products";

const ProductList = ({ dispatch }) => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false); // State for Add Product dialog
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await dispatch(getProductsById());
      if (!response.error) {
        setProducts(response.products);
      } else {
        console.error("Failed to fetch products:", response.error);
      }
    };
    fetchProducts();
  }, [dispatch]);

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleAddOpen = () => {
    setAddOpen(true); // Open Add Product dialog
  };

  const handleAddClose = () => {
    setAddOpen(false); // Close Add Product dialog
    setNewProduct({
      name: "",
      description: "",
      price: "",
      stock: "",
      image: null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const handleSave = async () => {
    if (selectedProduct) {
      try {
        const result = await dispatch(updateProductById(selectedProduct._id, selectedProduct));
        if (result && !result.error) {
          const updatedProducts = products.map((product) =>
            product._id === selectedProduct._id ? result : product
          );
          setProducts(updatedProducts);
        } else {
          console.error("Failed to update product:", result?.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error during product update:", error);
      }
    }
    handleClose();
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    if (newProduct.image) {
      formData.append("image", newProduct.image);
    }

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    const result = await dispatch(createProduct(formData)); // Pass FormData directly
    if (!result.error) {
      setProducts([...products, result]); // Add the new product to the list
    } else {
      console.error("Failed to add product:", result.error);
    }
    handleAddClose();
  };

  return (
    <>
      {/* Add Product Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddOpen}
        >
          Add Product
        </Button>
      </Box>

      <Grid container spacing={2}>
        {products.length > 0 ? (
          products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                {product.image && product.image.data ? (
                  <CardMedia
                  component="img"
                  height="150"
                  image={
                    product.image && product.image.data
                      ? `data:${product.image.contentType};base64,${product.image.data}`
                      : "/placeholder.jpg"
                  }
                  alt={product.name}
                />
                ) : (
                  <CardMedia
                    component="img"
                    height="150"
                    image="/placeholder.jpg"
                    alt="No image available"
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2">{product.description}</Typography>
                  <Typography variant="body1">Price: ₹{product.price}</Typography>
                  <Typography variant="body1">Stock: {product.stock}</Typography>
                  <Button onClick={() => handleOpen(product)}>Edit</Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No products available</Typography>
        )}
      </Grid>

      {/* Edit Product Dialog */}
      {selectedProduct && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              value={selectedProduct.name}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Description"
              name="description"
              value={selectedProduct.description}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={selectedProduct.price}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={selectedProduct.stock}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Add Product Dialog */}
      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={newProduct.name}
            onChange={handleNewProductChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Description"
            name="description"
            value={newProduct.description}
            onChange={handleNewProductChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={newProduct.price}
            onChange={handleNewProductChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={newProduct.stock}
            onChange={handleNewProductChange}
            fullWidth
            margin="dense"
          />
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button onClick={handleAddProduct} color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductList;