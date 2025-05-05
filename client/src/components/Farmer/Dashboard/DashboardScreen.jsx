import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { getProductsById } from "../../../actions/products";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Dynamic bar colors
const getBarColor = (index) => {
  const colors = [
    "#1976d2", "#388e3c", "#f57c00", "#d32f2f",
    "#7b1fa2", "#0097a7", "#fbc02d", "#5d4037",
  ];
  return colors[index % colors.length];
};

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
        setInStockCount(products.filter((p) => p.stock > 0).length);
        setOutOfStockCount(products.filter((p) => p.stock === 0).length);
        setLowStockCount(products.filter((p) => p.stock > 0 && p.stock < 10).length);
      }
    };
    fetchProductData();
  }, [dispatch]);

  const stockData = [
    { name: "In Stock", value: inStockCount },
    { name: "Out of Stock", value: outOfStockCount },
    { name: "Low Stock", value: lowStockCount },
  ];

  const barChartData = products.map((product) => ({
    name: product.name,
    stock: product.stock,
  }));

  const PIE_COLORS = ["#43a047", "#e53935", "#fb8c00"];

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {/* Summary Cards */}
      {[
        {
          title: "Total Products",
          value: productCount,
          border: "#1976d2",
          bg: "#e3f2fd",
          color: "#1565c0",
        },
        {
          title: "In Stock",
          value: inStockCount,
          border: "#2e7d32",
          bg: "#e8f5e9",
          color: "#1b5e20",
        },
        {
          title: "Out of Stock",
          value: outOfStockCount,
          border: "#c62828",
          bg: "#ffebee",
          color: "#b71c1c",
        },
        {
          title: "Low Stock",
          value: lowStockCount,
          border: "#ef6c00",
          bg: "#fff3e0",
          color: "#e65100",
        },
      ].map(({ title, value, border, bg, color }, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              height: 140,
              bgcolor: bg,
              border: `2px solid ${border}`,
              borderRadius: 3,
              textAlign: "center",
              boxShadow: 3,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: `0 6px 20px ${border}80`,
              },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight="600">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color }}>
              {value}
            </Typography>
          </Card>
        </Grid>
      ))}

      {/* Bar Chart */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            height: 360,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "scale(1.01)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            },
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Stock Levels by Product
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock">
                  {barChartData.map((_, index) => (
                    <Cell key={index} fill={getBarColor(index)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Pie Chart */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            height: 360,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "scale(1.01)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            },
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Stock Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stockData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {stockData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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
