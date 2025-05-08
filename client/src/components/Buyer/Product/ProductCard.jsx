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
  Divider
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
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
    setOpenDialog(true);
    dispatch(addCartItem(product.id,10))
    // Set a delay to show product info after the GIF
    setTimeout(() => setShowProductInfo(true), 2000); // 2-second delay
  };

  useEffect(() => {
    // Reset showProductInfo state when dialog is closed

    if (!openDialog) {
      setShowProductInfo(false);
    }
  }, [openDialog]);

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
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
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
                onClick={(e) => e.stopPropagation()}
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
        {/* 🎉 Background Celebration GIF */}
        <Box
          component="img"
          src="https://cdn.dribbble.com/userupload/22050859/file/original-0bc2fa58763cee104c6c6092a3ae2d91.gif"
          alt="confetti"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.5,
            zIndex: 0,
          }}
        />

        {/* 🔲 Content on top */}
        <DialogTitle sx={{ textAlign: 'center', zIndex: 1, position: 'relative' }}>
          🎉 Product Added!
        </DialogTitle>
        <Divider sx={{ zIndex: 1, position: 'relative' }} />
        <DialogContent sx={{ textAlign: 'center', mt: 1, zIndex: 1, position: 'relative' }}>
          {showProductInfo ? (
            <>
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
              <Typography variant="body2" color="text.secondary">
                was added to your cart!
              </Typography>
              {/* Price and Stock Information */}
              <Typography variant="subtitle1" fontWeight={500} sx={{ mt: 2 }}>
                ₹{price}/kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Stock: {stock > 0 ? `${stock} left` : 'Out of Stock'}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Please wait while we add the product to your cart...
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mt: 2, zIndex: 1, position: 'relative' }}>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Continue Shopping
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
