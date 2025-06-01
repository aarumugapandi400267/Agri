import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById } from '../../../actions/order';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Divider, IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FarkitLogo from '../../../assets/farkit-logo.png'; // If you have a logo image

export default function OrderDetails() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order = useSelector(state => state.farmerReducer.orders.find(o => o._id === orderId));
  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, [dispatch, orderId]);

  if (!order) return <Typography>Loading...</Typography>;

  const shipping = order.shippingAddress || {};

  // Simple invoice download as PDF using window.print()
  const handleDownloadInvoice = () => {
    const printContents = document.getElementById('invoice-section').innerHTML;
    const win = window.open('', '', 'height=700,width=700');
    win.document.write('<html><head><title>Invoice</title>');
    win.document.write('</head><body >');
    win.document.write(printContents);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  return (
    <Box maxWidth={700} mx="auto" mt={4}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2, float: 'right' }}
        onClick={handleDownloadInvoice}
      >
        Download Invoice
      </Button>
      <Box id="invoice-section">
        {/* Farkit Title/Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {/* If you have a logo, show it */}
          {/* <img src={FarkitLogo} alt="Farkit" style={{ height: 40, marginRight: 12 }} /> */}
          <Typography variant="h4" fontWeight={700} color="primary" sx={{ letterSpacing: 2 }}>
            Farkit
          </Typography>
          <Typography variant="subtitle1" sx={{ ml: 2, color: 'text.secondary' }}>
            Invoice
          </Typography>
        </Box>
        <Typography variant="h5" gutterBottom>Order #{order._id}</Typography>
        <Typography>Date: {new Date(order.createdAt).toLocaleString()}</Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight={600}>Shipping Address</Typography>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography>{shipping.name}</Typography>
            <Typography>
              {shipping.addressLine1}{shipping.addressLine2 ? `, ${shipping.addressLine2}` : ''},<br />
              {shipping.city}, {shipping.state}, {shipping.postalCode}, {shipping.country}
            </Typography>
            <Typography>Phone: {shipping.phone}</Typography>
          </CardContent>
        </Card>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight={600}>Order Items</Typography>
        {(order.products || []).map((item, idx) => (
          <Card key={idx} sx={{ mb: 2 }}>
            <CardContent>
              <Typography fontWeight={600}>
                {item.product?.name || 'Product'}
              </Typography>
              <Typography>Quantity: {item.quantity}</Typography>
              <Typography>Subtotal: ₹{item.subtotal}</Typography>
            </CardContent>
          </Card>
        ))}

        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Total: ₹{order.totalPrice}</Typography>
        <Typography>Status: {order.status}</Typography>
      </Box>
    </Box>
  );
}