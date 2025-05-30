import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from "@mui/material";
import { getProductsById, updateProductById, createProduct } from "../../../actions/products";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductList = ({ dispatch }) => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    category: "",
  });

  // Snackbar state
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackOpen(false);
  };

  const fetchProducts = async () => {
    const response = await dispatch(getProductsById());
    if (!response.error) {
      setProducts(response.products);
    } else {
      console.error("Failed to fetch products:", response.error);
    }
  };

  useEffect(() => {
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
    setAddOpen(true);
  };

  const handleAddClose = () => {
    setAddOpen(false);
    resetNewProductForm();
  };

  const resetNewProductForm = () => {
    setNewProduct({
      name: "",
      description: "",
      price: "",
      stock: "",
      image: null,
      category: "",
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
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
    }
  };

  const handleSave = async () => {
    if (selectedProduct) {
      try {
        const result = await dispatch(updateProductById(selectedProduct._id, selectedProduct));
        if (result && !result.error) {
          setProducts(products.map((product) =>
            product._id === selectedProduct._id ? result : product
          ));
          showSnackbar("Product updated successfully!", "success");
        } else {
          showSnackbar("Failed to update product", "error");
        }
      } catch (error) {
        console.error("Error during product update:", error);
        showSnackbar("Error while updating product", "error");
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
    formData.append("category", newProduct.category);
    if (newProduct.image) {
      formData.append("image", newProduct.image);
    }

    try {
      const result = await dispatch(createProduct(formData));
      if (!result.error) {
        setProducts([...products, result]);
        showSnackbar("Product added successfully!", "success");
      } else {
        showSnackbar("Failed to add product", "error");
      }
      handleAddClose();
    } catch (error) {
      console.error("Error during product creation:", error);
      showSnackbar("Error while adding product", "error");
    }
  };

  const renderProductCard = (product, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card
        sx={{
          border: "2px solid #ddd",
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
            borderColor: "#1976d2",
          },
        }}
      >
        <CardMedia
          component="img"
          height="180"
          image={product.image && product.image.data
            ? `data:${product.image.contentType};base64,${product.image.data}`
            : "/placeholder.jpg"
          }
          alt={product.name}
          sx={{ objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        />
        <CardContent sx={{ padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
            {product.name}
          </Typography>
          {/* Show product status */}
          <Typography
            variant="caption"
            sx={{
              color:
                product.status === "approved"
                  ? "green"
                  : product.status === "pending"
                  ? "orange"
                  : "red",
              fontWeight: 600,
              mb: 1,
              textTransform: "capitalize"
            }}
          >
            Status: {product.status}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
            {product.description}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', marginTop: 2 }}>
            ₹{product.price} /kg
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
            <Typography variant="body2" color="text.secondary">Stock: {product.stock}</Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Tooltip title="Edit Product">
                <IconButton onClick={() => handleOpen(product)} color="primary">
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Product">
                <IconButton color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <>
      {/* Add Product Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAddOpen} startIcon={<AddIcon />}>
          Add Product
        </Button>
      </Box>

      <Grid container spacing={2}>
        {products.length > 0 ? (
          products.map(renderProductCard)
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
              multiline
              rows={3}
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
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={selectedProduct.category}
                onChange={handleChange}
              >
                <MenuItem value="Fruits">Fruits</MenuItem>
                <MenuItem value="Vegetables">Vegetables</MenuItem>
                <MenuItem value="Dairy">Dairy</MenuItem>
                <MenuItem value="Grains">Grains</MenuItem>
              </Select>
            </FormControl>
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
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={newProduct.category}
              onChange={handleNewProductChange}
            >
              <MenuItem value="Fruits">Fruits</MenuItem>
              <MenuItem value="Vegetables">Vegetables</MenuItem>
              <MenuItem value="Dairy">Dairy</MenuItem>
              <MenuItem value="Grains">Grains</MenuItem>
            </Select>
          </FormControl>
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
          <Button onClick={handleAddProduct}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackSeverity}
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductList;
