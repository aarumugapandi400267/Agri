import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Tabs,
  Tab,
  useMediaQuery,
  Grid,
  TextField,
  IconButton,
  Tooltip,
  Popover,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { fetchOrders } from "../../../actions/user";
import { approveCancelRequest, approveCancelItem, updateItemStatus } from "../../../actions/order";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Link } from 'react-router-dom';

const ORDER_STATUSES = ["Pending", "Completed", "Cancelled", "Shipped", "Delivered"];
const PAYMENT_STATUSES = ["created", "paid", "failed"];

const FarmerOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [orderStatusTab, setOrderStatusTab] = useState(0);
  const [paymentStatusTab, setPaymentStatusTab] = useState(0);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [confirmItemOpen, setConfirmItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({ orderId: null, productId: null });

  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    dispatch(fetchOrders("farmer")).then((res) => {
      setOrders(res || []);
    });
  }, [dispatch]);

  // Get unique statuses from orders (for flexibility)
  const uniqueOrderStatuses = Array.from(new Set(orders.map(o => o.status))).filter(Boolean);
  const uniquePaymentStatuses = Array.from(new Set(orders.map(o => o.payment?.status))).filter(Boolean);

  // Use all possible statuses or only those present
  const orderStatuses = uniqueOrderStatuses.length ? uniqueOrderStatuses : ORDER_STATUSES;
  const paymentStatuses = uniquePaymentStatuses.length ? uniquePaymentStatuses : PAYMENT_STATUSES;

  // Filter orders by selected order status and payment status
  let filteredOrders = orders;
  if (orderStatuses[orderStatusTab]) {
    filteredOrders = filteredOrders.filter(order => order.status === orderStatuses[orderStatusTab]);
  }
  if (paymentStatuses[paymentStatusTab]) {
    filteredOrders = filteredOrders.filter(order => order.payment?.status === paymentStatuses[paymentStatusTab]);
  }

  // Filter by date range
  if (startDate) {
    filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) >= new Date(startDate));
  }
  if (endDate) {
    // Add 1 day to include the end date fully
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) < end);
  }

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  // Approve Cancel for Order
  const handleApproveCancel = (orderId) => {
    setSelectedOrderId(orderId);
    setConfirmOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (selectedOrderId) {
      try {
        await dispatch(approveCancelRequest(selectedOrderId));
        setAlert({ open: true, message: "Order cancellation approved.", severity: "success" });
        // Refresh orders after approval
        dispatch(fetchOrders("farmer")).then((res) => {
          setOrders(res || []);
        });
      } catch (error) {
        setAlert({ open: true, message: error.message, severity: "error" });
      }
    }
    setConfirmOpen(false);
    setSelectedOrderId(null);
  };

  // Approve Cancel for Item
  const handleApproveCancelItem = (orderId, productId) => {
    setSelectedItem({ orderId, productId });
    setConfirmItemOpen(true);
  };

  const handleConfirmApproveItem = async () => {
    const { orderId, productId } = selectedItem;
    if (orderId && productId) {
      try {
        await dispatch(approveCancelItem(orderId, productId));
        setAlert({ open: true, message: "Item cancellation approved.", severity: "success" });
        dispatch(fetchOrders("farmer")).then((res) => {
          setOrders(res || []);
        });
      } catch (error) {
        setAlert({ open: true, message: error.message, severity: "error" });
      }
    }
    setConfirmItemOpen(false);
    setSelectedItem({ orderId: null, productId: null });
  };

  // Add handler for updating item status
  const handleUpdateItemStatus = async (orderId, productId, status) => {
    try {
      await dispatch(updateItemStatus(orderId, productId, status));
      setAlert({ open: true, message: `Item marked as ${status}.`, severity: "success" });
      dispatch(fetchOrders("farmer")).then((res) => {
        setOrders(res || []);
      });
    } catch (error) {
      setAlert({ open: true, message: error.message, severity: "error" });
    }
  };

  const handleConfirmDialogClose = () => {
    setConfirmOpen(false);
    setSelectedOrderId(null);
  };

  const handleConfirmItemDialogClose = () => {
    setConfirmItemOpen(false);
    setSelectedItem({ orderId: null, productId: null });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Tooltip title="Filter by date">
          <IconButton onClick={handleFilterClick} size="small">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            label="Start"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <TextField
            label="End"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
          <Tooltip title="Clear date filters">
            <IconButton
              color="error"
              size="small"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                handleFilterClose();
              }}
              sx={{ ml: 1 }}
            >
              ✕
            </IconButton>
          </Tooltip>
        </Box>
      </Popover>
      {/* Order Status Tabs */}
      <Tabs
        value={orderStatusTab}
        onChange={(_, newValue) => setOrderStatusTab(newValue)}
        sx={{ mb: 1 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {orderStatuses.map((status, idx) => (
          <Tab
            key={idx}
            label={`${status} (${orders.filter(o => o.status === status).length})`}
          />
        ))}
      </Tabs>
      {/* Payment Status Tabs */}
      <Tabs
        value={paymentStatusTab}
        onChange={(_, newValue) => setPaymentStatusTab(newValue)}
        sx={{ mb: 2 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {paymentStatuses.map((status, idx) => (
          <Tab
            key={idx}
            label={`${status.charAt(0).toUpperCase() + status.slice(1)} (${orders.filter(o => o.payment?.status === status).length})`}
          />
        ))}
      </Tabs>
      {filteredOrders.length === 0 ? (
        <Typography color="text.secondary">No orders found.</Typography>
      ) : isDesktop ? (
        <Grid container spacing={2}>
          {filteredOrders.map((order) => (
            <Grid item xs={12} md={6} lg={4} key={order._id}>
              <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" color="text.secondary">
                      Order ID: {order._id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Customer: {order.user?.name || "N/A"}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip label={order.status} size="small" color={order.status === "Pending" ? "warning" : order.status === "Cancelled" ? "error" : "success"} />
                    <Chip label={order.payment?.status || "N/A"} size="small" color={order.payment?.status === "paid" ? "success" : order.payment?.status === "failed" ? "error" : "info"} />
                  </Stack>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body2" fontWeight={600}>Products:</Typography>
                  {order.products.map((item) => (
                    <Box key={item.product?._id} sx={{ mb: 0.5, ml: 1 }}>
                      <Typography variant="body2">
                        {item.product?.name} x{item.quantity} — ₹{item.subtotal}
                      </Typography>
                      {/* Status update dropdown */}
                      {["Pending", "Shipped", "OutForDelivery"].includes(item.status) && (
                        <TextField
                          select
                          size="small"
                          label="Update Status"
                          value={item.status}
                          onChange={e =>
                            handleUpdateItemStatus(order._id, item.product?._id, e.target.value)
                          }
                          sx={{ mt: 1, minWidth: 140 }}
                          SelectProps={{ native: true }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="OutForDelivery">OutForDelivery</option>
                          <option value="Delivered">Delivered</option>
                        </TextField>
                      )}
                      {/* Approve Cancel for Item */}
                      {item.status === "CancelRequested" && (
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          sx={{ mt: 0.5 }}
                          onClick={() => handleApproveCancelItem(order._id, item.product?._id)}
                        >
                          Approve Item Cancel
                        </Button>
                      )}
                    </Box>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" fontWeight={600}>
                    Total: ₹{order.totalPrice}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Shipping: {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Link to={`/farmer/orders/${order._id}`}>
                      <Button variant="outlined" size="small">View Details</Button>
                    </Link>
                    {/* Approve Cancel Button for Order */}
                    {order.status === "CancelRequested" && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleApproveCancel(order._id)}
                      >
                        Approve Cancel
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack spacing={2}>
          {filteredOrders.map((order) => (
            <Card key={order._id} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" color="text.secondary">
                    Order ID: {order._id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Customer: {order.user?.name || "N/A"}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip label={order.status} size="small" color={order.status === "Pending" ? "warning" : order.status === "Cancelled" ? "error" : "success"} />
                  <Chip label={order.payment?.status || "N/A"} size="small" color={order.payment?.status === "paid" ? "success" : order.payment?.status === "failed" ? "error" : "info"} />
                </Stack>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2" fontWeight={600}>Products:</Typography>
                {order.products.map((item) => (
                  <Box key={item.product?._id} sx={{ mb: 0.5, ml: 1 }}>
                    <Typography variant="body2">
                      {item.product?.name} x{item.quantity} — ₹{item.subtotal}
                    </Typography>
                    {/* Status update dropdown */}
                    {["Pending", "Shipped", "OutForDelivery"].includes(item.status) && (
                      <TextField
                        select
                        size="small"
                        label="Update Status"
                        value={item.status}
                        onChange={e =>
                          handleUpdateItemStatus(order._id, item.product?._id, e.target.value)
                        }
                        sx={{ mt: 1, minWidth: 140 }}
                        SelectProps={{ native: true }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="OutForDelivery">OutForDelivery</option>
                        <option value="Delivered">Delivered</option>
                      </TextField>
                    )}
                    {/* Approve Cancel for Item */}
                    {item.status === "CancelRequested" && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ mt: 0.5 }}
                        onClick={() => handleApproveCancelItem(order._id, item.product?._id)}
                      >
                        Approve Item Cancel
                      </Button>
                    )}
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" fontWeight={600}>
                  Total: ₹{order.totalPrice}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Shipping: {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Link to={`/farmer/orders/${order._id}`}>
                    <Button variant="outlined" size="small">View Details</Button>
                  </Link>
                  {/* Approve Cancel Button for Order */}
                  {order.status === "CancelRequested" && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleApproveCancel(order._id)}
                    >
                      Approve Cancel
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
      {/* Snackbar for alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      {/* Confirm Dialog for Approve Cancel (Order) */}
      <Dialog open={confirmOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Approve Cancellation</DialogTitle>
        <DialogContent>
          Are you sure you want to approve the cancellation for this order?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmApprove} color="error" variant="contained">
            Yes, Approve Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirm Dialog for Approve Cancel (Item) */}
      <Dialog open={confirmItemOpen} onClose={handleConfirmItemDialogClose}>
        <DialogTitle>Approve Item Cancellation</DialogTitle>
        <DialogContent>
          Are you sure you want to approve the cancellation for this item?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmItemDialogClose} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmApproveItem} color="error" variant="contained">
            Yes, Approve Item Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FarmerOrderList;