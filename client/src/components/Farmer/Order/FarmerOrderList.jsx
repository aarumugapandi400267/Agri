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
  Paper,
  Avatar,
  Badge,
  LinearProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { fetchOrders } from "../../../actions/user";
import { approveCancelRequest, approveCancelItem, updateItemStatus } from "../../../actions/order";
import {
  FilterList,
  Clear,
  Cancel,
  CheckCircle,
  LocalShipping,
  Inventory,
  AssignmentReturned,
  Receipt,
  Person,
  CalendarToday,
  Payment,
  ShoppingBasket,
  LocationOn,
  MoreVert,
} from "@mui/icons-material";
import { Link } from 'react-router-dom';

const FarmerOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const ORDER_STATUSES = ["All", "Pending", "Processing", "Shipped", "Delivered", "CancelRequested", "Cancelled"];
  const PAYMENT_STATUSES = ["All", "created", "paid", "failed"];

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const res = await dispatch(fetchOrders("farmer"));
        setOrders(res || []);
      } catch (error) {
        setAlert({ open: true, message: "Failed to load orders", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [dispatch]);

  // Filter orders by selected order status and payment status
  let filteredOrders = orders;
  if (orderStatusTab > 0) {
    filteredOrders = filteredOrders.filter(order => order.status === ORDER_STATUSES[orderStatusTab]);
  }
  if (paymentStatusTab > 0) {
    filteredOrders = filteredOrders.filter(order => order.payment?.status === PAYMENT_STATUSES[paymentStatusTab]);
  }

  // Filter by date range
  if (startDate) {
    filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) >= new Date(startDate));
  }
  if (endDate) {
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

  const handleApproveCancel = (orderId) => {
    setSelectedOrderId(orderId);
    setConfirmOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (selectedOrderId) {
      try {
        await dispatch(approveCancelRequest(selectedOrderId));
        setAlert({ open: true, message: "Order cancellation approved", severity: "success" });
        dispatch(fetchOrders("farmer")).then((res) => setOrders(res || []));
      } catch (error) {
        setAlert({ open: true, message: error.message, severity: "error" });
      }
    }
    setConfirmOpen(false);
    setSelectedOrderId(null);
  };

  const handleApproveCancelItem = (orderId, productId) => {
    setSelectedItem({ orderId, productId });
    setConfirmItemOpen(true);
  };

  const handleConfirmApproveItem = async () => {
    const { orderId, productId } = selectedItem;
    if (orderId && productId) {
      try {
        await dispatch(approveCancelItem(orderId, productId));
        setAlert({ open: true, message: "Item cancellation approved", severity: "success" });
        dispatch(fetchOrders("farmer")).then((res) => setOrders(res || []));
      } catch (error) {
        setAlert({ open: true, message: error.message, severity: "error" });
      }
    }
    setConfirmItemOpen(false);
    setSelectedItem({ orderId: null, productId: null });
  };

  const handleUpdateItemStatus = async (orderId, productId, status) => {
    try {
      await dispatch(updateItemStatus(orderId, productId, status));
      setAlert({ open: true, message: `Item marked as ${status}`, severity: "success" });
      dispatch(fetchOrders("farmer")).then((res) => setOrders(res || []));
    } catch (error) {
      setAlert({ open: true, message: error.message, severity: "error" });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "warning";
      case "Processing": return "info";
      case "Shipped": return "primary";
      case "Delivered": return "success";
      case "CancelRequested": return "error";
      case "Cancelled": return "error";
      default: return "default";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "paid": return "success";
      case "failed": return "error";
      default: return "info";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Inventory color="warning" />;
      case "Processing": return <MoreVert color="info" />;
      case "Shipped": return <LocalShipping color="primary" />;
      case "Delivered": return <CheckCircle color="success" />;
      case "CancelRequested": return <AssignmentReturned color="error" />;
      case "Cancelled": return <Cancel color="error" />;
      default: return <Receipt />;
    }
  };

  return (
    <Box sx={{ p: isDesktop ? 3 : 2 }}>
      {loading && <LinearProgress color="primary" />}
      
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="h5" fontWeight="bold">
            Orders Management
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Filter by date">
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={handleFilterClick}
                size="small"
                sx={{ borderRadius: 2 }}
              >
                Filters
              </Button>
            </Tooltip>
          </Stack>
        </Stack>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{ sx: { p: 2, borderRadius: 2 } }}
        >
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarToday color="action" fontSize="small" />
              <Typography variant="subtitle2">Date Range</Typography>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Start Date"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                sx={{ minWidth: 180 }}
              />
              <TextField
                label="End Date"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                sx={{ minWidth: 180 }}
              />
            </Stack>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Clear />}
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              sx={{ alignSelf: 'flex-end' }}
            >
              Clear
            </Button>
          </Stack>
        </Popover>

        <Tabs
          value={orderStatusTab}
          onChange={(_, newValue) => setOrderStatusTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mt: 2 }}
        >
          {ORDER_STATUSES.map((status, idx) => (
            <Tab
              key={status}
              label={
                <Badge badgeContent={orders.filter(o => idx === 0 ? true : o.status === status).length} color="primary">
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    {getStatusIcon(status)}
                    <span>{status}</span>
                  </Stack>
                </Badge>
              }
              sx={{ minHeight: 48, textTransform: 'none' }}
            />
          ))}
        </Tabs>

        <Tabs
          value={paymentStatusTab}
          onChange={(_, newValue) => setPaymentStatusTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 1 }}
        >
          {PAYMENT_STATUSES.map((status, idx) => (
            <Tab
              key={status}
              label={
                <Badge badgeContent={orders.filter(o => idx === 0 ? true : o.payment?.status === status).length} color="primary">
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Payment fontSize="small" />
                    <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  </Stack>
                </Badge>
              }
              sx={{ minHeight: 48, textTransform: 'none' }}
            />
          ))}
        </Tabs>
      </Paper>

      {filteredOrders.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            {loading ? 'Loading orders...' : 'No orders found matching your criteria'}
          </Typography>
        </Paper>
      ) : isDesktop ? (
        <Grid container spacing={3}>
          {filteredOrders.map((order) => (
            <Grid item xs={12} md={6} lg={4} key={order._id}>
              <Card elevation={2} sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                    <Stack>
                      <Typography variant="subtitle2" color="text.secondary">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <CalendarToday fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Chip 
                        label={order.status} 
                        size="small" 
                        color={getStatusColor(order.status)}
                        icon={getStatusIcon(order.status)}
                        sx={{ fontWeight: 500 }}
                      />
                      {order.payment?.status && (
                        <Chip 
                          label={order.payment.status} 
                          size="small" 
                          color={getPaymentColor(order.payment.status)}
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                    </Stack>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 1 }}>
                    <Person color="action" />
                    <Typography variant="body2">
                      {order.user?.name || 'Customer'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <LocationOn color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {order.shippingAddress?.city || 'Unknown location'}
                    </Typography>
                  </Stack>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    <ShoppingBasket color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Products ({order.products.length})
                  </Typography>

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    {order.products.map((item) => (
                      <Paper key={item.product?._id} elevation={0} sx={{ p: 1, borderRadius: 1, bgcolor: 'background.default' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar 
                            src={item.product?.images?.[0]} 
                            alt={item.product?.name}
                            sx={{ width: 40, height: 40 }}
                          >
                            {item.product?.name?.[0]}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" fontWeight={500}>
                              {item.product?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.quantity} × ₹{item.price} = ₹{item.subtotal}
                            </Typography>
                          </Box>
                        </Stack>

                        <Box sx={{ mt: 1, ml: 6 }}>
                          {["Pending", "Processing", "Shipped", "OutForDelivery"].includes(item.status) ? (
                            <Select
                              value={item.status}
                              onChange={e => handleUpdateItemStatus(order._id, item.product?._id, e.target.value)}
                              size="small"
                              fullWidth
                              sx={{ borderRadius: 2 }}
                            >
                              <MenuItem value="Pending">Pending</MenuItem>
                              <MenuItem value="Processing">Processing</MenuItem>
                              <MenuItem value="Shipped">Shipped</MenuItem>
                              <MenuItem value="OutForDelivery">Out for Delivery</MenuItem>
                              <MenuItem value="Delivered">Delivered</MenuItem>
                            </Select>
                          ) : (
                            <Chip 
                              label={item.status} 
                              size="small" 
                              color={getStatusColor(item.status)}
                              sx={{ mt: 0.5 }}
                            />
                          )}

                          {item.status === "CancelRequested" && (
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => handleApproveCancelItem(order._id, item.product?._id)}
                              sx={{ mt: 1, borderRadius: 2 }}
                              fullWidth
                            >
                              Approve Item Cancel
                            </Button>
                          )}
                        </Box>
                      </Paper>
                    ))}
                  </Stack>

                  <Divider sx={{ my: 1 }} />

                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Total Amount
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      ₹{order.totalPrice}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Button
                      component={Link}
                      to={`/farmer/orders/${order._id}`}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ borderRadius: 2 }}
                    >
                      View Details
                    </Button>
                    {order.status === "CancelRequested" && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={() => handleApproveCancel(order._id)}
                        fullWidth
                        sx={{ borderRadius: 2 }}
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
            <Card key={order._id} elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                  <Stack>
                    <Typography variant="subtitle2" color="text.secondary">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      <CalendarToday fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Chip 
                      label={order.status} 
                      size="small" 
                      color={getStatusColor(order.status)}
                      icon={getStatusIcon(order.status)}
                    />
                    {order.payment?.status && (
                      <Chip 
                        label={order.payment.status} 
                        size="small" 
                        color={getPaymentColor(order.payment.status)}
                      />
                    )}
                  </Stack>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 1 }}>
                  <Person color="action" />
                  <Typography variant="body2">
                    {order.user?.name || 'Customer'}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 1 }} />

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  <ShoppingBasket color="action" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Products ({order.products.length})
                </Typography>

                <Stack spacing={1} sx={{ mb: 2 }}>
                  {order.products.map((item) => (
                    <Box key={item.product?._id} sx={{ mb: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar 
                          src={item.product?.images?.[0]} 
                          alt={item.product?.name}
                          sx={{ width: 40, height: 40 }}
                        >
                          {item.product?.name?.[0]}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {item.product?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.quantity} × ₹{item.price} = ₹{item.subtotal}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box sx={{ mt: 1, ml: 6 }}>
                        {["Pending", "Processing", "Shipped", "OutForDelivery"].includes(item.status) ? (
                          <Select
                            value={item.status}
                            onChange={e => handleUpdateItemStatus(order._id, item.product?._id, e.target.value)}
                            size="small"
                            fullWidth
                            sx={{ borderRadius: 2, mt: 1 }}
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Processing">Processing</MenuItem>
                            <MenuItem value="Shipped">Shipped</MenuItem>
                            <MenuItem value="OutForDelivery">Out for Delivery</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                          </Select>
                        ) : (
                          <Chip 
                            label={item.status} 
                            size="small" 
                            color={getStatusColor(item.status)}
                            sx={{ mt: 0.5 }}
                          />
                        )}

                        {item.status === "CancelRequested" && (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<CheckCircle />}
                            onClick={() => handleApproveCancelItem(order._id, item.product?._id)}
                            sx={{ mt: 1, borderRadius: 2 }}
                            fullWidth
                          >
                            Approve Item Cancel
                          </Button>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Stack>

                <Divider sx={{ my: 1 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total Amount
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    ₹{order.totalPrice}
                  </Typography>
                </Stack>

                <Button
                  component={Link}
                  to={`/farmer/orders/${order._id}`}
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  View Details
                </Button>
                {order.status === "CancelRequested" && (
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<CheckCircle />}
                    onClick={() => handleApproveCancel(order._id)}
                    fullWidth
                    sx={{ borderRadius: 2 }}
                  >
                    Approve Cancel
                  </Button>
                )}
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
          elevation={6}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Confirm Dialog for Approve Cancel (Order) */}
      <Dialog 
        open={confirmOpen} 
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          <AssignmentReturned color="error" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Approve Order Cancellation
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to approve the cancellation for this order? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setConfirmOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmApprove} 
            color="error" 
            variant="contained"
            startIcon={<CheckCircle />}
            sx={{ borderRadius: 2 }}
          >
            Confirm Approval
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog for Approve Cancel (Item) */}
      <Dialog 
        open={confirmItemOpen} 
        onClose={() => setConfirmItemOpen(false)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          <AssignmentReturned color="error" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Approve Item Cancellation
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to approve the cancellation for this item? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setConfirmItemOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmApproveItem} 
            color="error" 
            variant="contained"
            startIcon={<CheckCircle />}
            sx={{ borderRadius: 2 }}
          >
            Confirm Approval
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FarmerOrderList;