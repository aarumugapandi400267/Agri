import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Select,
  MenuItem,
  InputAdornment,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { fetchAllProducts, editProduct } from "../../actions/admin"; // <-- Use actions

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const productsPerPage = 10;

export default function ProductApproval() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchAllProducts()).then((data) => {
      setProducts(data || []);
      setIsLoading(false);
    });
  }, [dispatch]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination logic
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#fbc02d";
      case "approved":
        return "#43a047";
      case "rejected":
        return "#e53935";
      default:
        return "#bdbdbd";
    }
  };

  // Approve or reject product
  const handleUpdateStatus = async (id, approved) => {
    setActionLoading(true);
    await dispatch(editProduct(id, { status: approved ? "approved" : "rejected" }));
    setProducts((prev) =>
      prev.map((p) =>
        p._id === id
          ? { ...p, status: approved ? "approved" : "rejected", approved }
          : p
      )
    );
    setActionLoading(false);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Product Approval
      </Typography>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 2,
              alignItems: { sm: "center" },
              justifyContent: "space-between",
            }}
          >
            <TextField
              placeholder="Search products..."
              size="small"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
            <Select
              size="small"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              sx={{ minWidth: 160 }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Farmer</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Skeleton variant="rounded" width={40} height={40} />
                            <Box sx={{ ml: 2 }}>
                              <Skeleton width={80} />
                              <Skeleton width={40} />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Skeleton width={80} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={60} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={60} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={60} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={80} />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton width={60} />
                        </TableCell>
                      </TableRow>
                    ))
                  : currentProducts.length > 0
                  ? currentProducts.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              variant="rounded"
                              src={product.images?.[0]}
                              alt={product.name}
                              sx={{ width: 40, height: 40, bgcolor: "#e0e0e0" }}
                            >
                              {product.name?.charAt(0)}
                            </Avatar>
                            <Box sx={{ ml: 2 }}>
                              <Typography fontWeight={600}>{product.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                #{product._id?.toString().slice(-4)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            Farmer #{product.farmerId || "N/A"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {product.location || ""}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ textTransform: "capitalize" }}>
                            {product.category}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            ₹{product.price}/{product.unit}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <span
                            style={{
                              background: getStatusColor(product.status),
                              color: "#fff",
                              borderRadius: 12,
                              padding: "2px 12px",
                              fontSize: 12,
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {product.status || "pending"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(product.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {product.status === "pending" && (
                            <>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                sx={{ mr: 1 }}
                                onClick={() => handleUpdateStatus(product._id, true)}
                                disabled={actionLoading}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => handleUpdateStatus(product._id, false)}
                                disabled={actionLoading}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          <Button variant="outlined" size="small" sx={{ ml: 1 }}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No products found. Try adjusting your filter criteria.
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}