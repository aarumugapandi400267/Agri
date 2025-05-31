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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { fetchOrders } from "../../../actions/user";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Link } from 'react-router-dom';

const FarmerOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    dispatch(fetchOrders("farmer")).then((res) => {
      setOrders(res || []);
    });
  }, [dispatch]);

  // Filter orders by status
  const pendingOrders = orders.filter((order) => order.status === "Pending");
  const completedOrders = orders.filter((order) => order.status === "Completed");

  // Filter by tab
  let tabOrders = tab === 0 ? pendingOrders : completedOrders;

  // Filter by date range
  if (startDate) {
    tabOrders = tabOrders.filter(order => new Date(order.createdAt) >= new Date(startDate));
  }
  if (endDate) {
    // Add 1 day to include the end date fully
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    tabOrders = tabOrders.filter(order => new Date(order.createdAt) < end);
  }

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
        open={open}
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
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        sx={{ mb: 2 }}
        variant="fullWidth"
      >
        <Tab label={`Pending (${pendingOrders.length})`} />
        <Tab label={`Completed (${completedOrders.length})`} />
      </Tabs>
      {tabOrders.length === 0 ? (
        <Typography color="text.secondary">No orders found.</Typography>
      ) : isDesktop ? (
        <Grid container spacing={2}>
          {tabOrders.map((order) => (
            <Grid item xs={12} md={6} lg={4} key={order._id}>
              <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order ID: {order._id}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Customer: {order.user?.name || "N/A"}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip label={order.status} size="small" />
                    <Chip label={order.payment?.status || "N/A"} size="small" color="info" />
                  </Stack>
                  <Divider sx={{ mb: 1 }} />
                  {order.products.map((item) => (
                    <Box key={item.product?._id} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <b>{item.product?.name}</b> x{item.quantity} — ₹{item.subtotal}
                      </Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Date: {new Date(order.createdAt).toLocaleString()}
                  </Typography>
                  <Link to={`/farmer/orders/${order._id}`}>
                    <Button variant="outlined">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack spacing={2}>
          {tabOrders.map((order) => (
            <Card key={order._id} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Order ID: {order._id}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Customer: {order.user?.name || "N/A"}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip label={order.status} size="small" />
                  <Chip label={order.payment?.status || "N/A"} size="small" color="info" />
                </Stack>
                <Divider sx={{ mb: 1 }} />
                {order.products.map((item) => (
                  <Box key={item.product?._id} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      <b>{item.product?.name}</b> x{item.quantity} — ₹{item.subtotal}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Date: {new Date(order.createdAt).toLocaleString()}
                </Typography>
                <Link to={`/farmer/orders/${order._id}`}>
                  <Button variant="outlined">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default FarmerOrderList;