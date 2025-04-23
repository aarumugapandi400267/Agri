import { Card, CardContent, Typography, Button, CardMedia } from "@mui/material";

const ProductCard = ({ product }) => {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      {product.image && (
        <CardMedia
          component="img"
          height="140"
          image={`data:${product.image.contentType};base64,${product.image.data}`}
          alt={product.name}
        />
      )} 
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary">
          ${product.price} /kg
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stock: {product.stock} in kgs.
        </Typography>
        <Button variant="contained" color="secondary" sx={{ mt: 1 }}>
          Edit
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
