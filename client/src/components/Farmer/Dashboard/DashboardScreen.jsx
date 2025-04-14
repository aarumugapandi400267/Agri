import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { getProductsById } from "../../../actions/products";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function DashboardScreen() {
  const [productCount, setProductCount] = useState(0);
  const [inStockCount, setInStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProductData = async () => {
      const response = await dispatch(getProductsById());
      if (!response.error) {
        const products = response.products;
        setProducts(products);
        setProductCount(products.length);
        setInStockCount(products.filter((product) => product.stock > 0).length);
        setOutOfStockCount(products.filter((product) => product.stock === 0).length);
        setLowStockCount(products.filter((product) => product.stock > 0 && product.stock < 10).length);
      } else {
        console.error("Failed to fetch product data:", response.error);
      }
    };
    fetchProductData();
  }, [dispatch]);

  // Data for the charts
  const stockData = [
    { name: "In Stock", value: inStockCount },
    { name: "Out of Stock", value: outOfStockCount },
    { name: "Low Stock", value: lowStockCount },
  ];

  const barChartData = products.map((product) => ({
    name: product.name,
    stock: product.stock,
  }));

  const COLORS = ["#4caf50", "#f44336", "#ff9800"];

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      {/* Total Products Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ bgcolor: "#f5f5f5", textAlign: "center" }}>
          <CardContent>
            <Typography variant="h5">Total Products</Typography>
            <Typography variant="h4" color="primary">
              {productCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Products in Stock Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ bgcolor: "#e8f5e9", textAlign: "center" }}>
          <CardContent>
            <Typography variant="h5">Products in Stock</Typography>
            <Typography variant="h4" color="green">
              {inStockCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Out of Stock Products Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ bgcolor: "#ffebee", textAlign: "center" }}>
          <CardContent>
            <Typography variant="h5">Out of Stock</Typography>
            <Typography variant="h4" color="red">
              {outOfStockCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Low Stock Alerts Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ bgcolor: "#fff3e0", textAlign: "center" }}>
          <CardContent>
            <Typography variant="h5">Low Stock Alerts</Typography>
            <Typography variant="h4" color="orange">
              {lowStockCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Bar Chart for Stock Levels */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Stock Levels by Product
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#3f51b5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Pie Chart for Stock Distribution */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Stock Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  ); 
}