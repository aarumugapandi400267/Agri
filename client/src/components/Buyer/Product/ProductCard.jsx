import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Link,
  Tooltip,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grow,
  Divider,
  IconButton
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { addCartItem } from '../../../actions/customer/cart';
import {useDispatch} from "react-redux"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const {
    name,
    description = "No description available",
    price,
    stock,
    farmer = "Unknown",
    image,
    id
  } = product;

  const imageUrl = image?.data
    ? `data:${image.contentType};base64,${image.data}`
    : "/placeholder.jpg";

  const [showFullDesc, setShowFullDesc] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showProductInfo, setShowProductInfo] = useState(false);
  const [isBuyNowMode, setIsBuyNowMode] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const toggleDescription = (e) => {
    e.stopPropagation();
    setShowFullDesc((prev) => !prev);
  };

  const getStockChip = () => {
    if (stock > 10) return <Chip label="In Stock" color="success" size="small" />;
    if (stock > 0) return <Chip label="Few Left" color="warning" size="small" />;
    return <Chip label="Out of Stock" color="error" size="small" />;
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsBuyNowMode(false);
    setOpenDialog(true);
    setTimeout(() => setShowProductInfo(true), 2000);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    setIsBuyNowMode(true);
    setOpenDialog(true);
    dispatch(addCartItem(product.id,10))
    // Set a delay to show product info after the GIF
    setTimeout(() => setShowProductInfo(true), 2000); // 2-second delay
  };

  useEffect(() => {
    // Reset showProductInfo state when dialog is closed
    if (!openDialog) {
      setShowProductInfo(false);
      setQuantity(1);
    }
  }, [openDialog]);

  const totalAmount = quantity * price;

  const increaseQty = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 320,
          minHeight: 460,
          m: 2,
          borderRadius: 3,
          boxShadow: 3,
          transition: 'transform 0.3s, box-shadow 0.3s',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: 6,
          },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        onClick={() => navigate(`/product/${id}`, { state: { product } })}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="180"
            image={imageUrl}
            alt={name}
            sx={{
              objectFit: 'cover',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          />
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            {getStockChip()}
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
            {name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              maxHeight: showFullDesc ? 'none' : 48,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: showFullDesc ? 'unset' : 2,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
            }}
          >
            {description}
          </Typography>

          {description.length > 100 && (
            <Link
              component="button"
              variant="body2"
              onClick={toggleDescription}
              sx={{ mt: 1, display: 'block' }}
            >
              {showFullDesc ? 'Show Less' : 'Read More'}
            </Link>
          )}

          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight={500}>
              ₹{price}/kg
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Farmer: {farmer}
            </Typography>
          </Box>

          <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
            <Tooltip title="Buy Now">
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleBuyNow}
                sx={{ borderRadius: 8 }}
              >
                <ShoppingBagIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Add to Cart">
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleAddToCart}
                sx={{ borderRadius: 8 }}
              >
                <ShoppingCartIcon />
              </Button>
            </Tooltip>
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            position: 'relative',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          {isBuyNowMode ? '🛒 Confirm Purchase' : '🎉 Product Added!'}
        </DialogTitle>
        <Divider />

        <DialogContent sx={{ textAlign: 'center', mt: 1 }}>
          <img
            src={imageUrl}
            alt={name}
            style={{
              width: 100,
              height: 100,
              objectFit: 'cover',
              borderRadius: 12,
              marginBottom: 12,
            }}
          />
          <Typography variant="h6">{name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {isBuyNowMode ? 'Choose quantity and confirm' : 'was added to your cart!'}
          </Typography>

          {isBuyNowMode && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  mb: 2
                }}
              >
                <IconButton
                  onClick={decreaseQty}
                  disabled={quantity <= 1}
                  color="primary"
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="h6">{quantity} kg</Typography>
                <IconButton
                  onClick={increaseQty}
                  disabled={quantity >= stock}
                  color="primary"
                >
                  <AddIcon />
                </IconButton>
              </Box>

              <Typography variant="subtitle1" fontWeight={600}>
                Total: ₹{totalAmount}
              </Typography>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
          <Button variant="outlined" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          {isBuyNowMode ? (
            <Button variant="contained" color="success">
              Pay ₹{totalAmount}
            </Button>
          ) : (
            <Button variant="contained" onClick={() => setOpenDialog(false)}>
              Continue Shopping
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
