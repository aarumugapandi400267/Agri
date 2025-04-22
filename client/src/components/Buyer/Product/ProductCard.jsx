import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box, Link, Tooltip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';


export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { name, description, price, stock, farmer, image, id } = product;

    const imageUrl = image?.data
        ? `data:${image.contentType};base64,${image.data}`
        : "/placeholder.jpg";

    const [showFullDesc, setShowFullDesc] = useState(false);

    const toggleDescription = (e) => {
        e.stopPropagation(); // prevent card click
        setShowFullDesc(prev => !prev);
    };

    const stockStatus = stock > 5 ? 'In Stock' : stock > 0 ? 'Only a few left!' : 'Out of Stock';

    return (
        <Card
            sx={{ maxWidth: 300, m: 2, cursor: 'pointer' }}
            onClick={() => navigate(`/product/${id}`, { state: { product } })}
        >
            <CardMedia
                component="img"
                height="160"
                image={imageUrl}
                alt={name}
            />
            <CardContent>
                <Typography variant="h6" gutterBottom>{name}</Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        minHeight: 48, // Reserve space for at least 2 lines
                        maxHeight: showFullDesc ? 'none' : 48,
                        display: '-webkit-box',
                        WebkitLineClamp: showFullDesc ? 'unset' : 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        transition: 'max-height 0.3s ease',
                    }}
                >
                    {description}
                </Typography>


                <Box mt={1}>
                    {description.length > 100 && (
                        <Link
                            component="button"
                            variant="body2"
                            onClick={toggleDescription}
                            sx={{ mt: 1 }}
                        >
                            {showFullDesc ? 'Show Less' : 'Read More'}
                        </Link>
                    )}
                </Box>


                <Box mt={1}>
                    <Typography variant="subtitle2">Price: ₹{price}/kg</Typography>
                    <Typography
                        variant="subtitle2"
                        color={stock > 0 ? 'green' : 'error'}
                    >
                        {stockStatus}
                    </Typography>
                    <Typography variant="subtitle2">Farmer: {farmer}</Typography>
                </Box>

                <Box mt={2} textAlign="center">
                    <Tooltip title="Buy Now">
                        <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                            <ShoppingBagIcon />
                        </Button>
                    </Tooltip>

                    <Tooltip title="Add to Cart">
                        <Button variant="contained" color="primary">
                            <ShoppingCartIcon />
                        </Button>
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    );
}
