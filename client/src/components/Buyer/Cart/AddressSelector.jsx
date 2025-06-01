import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Avatar,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  AddLocationAlt as AddLocationAltIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const AddressSelector = ({
  addresses = [],
  selectedIndex,
  onSelect,
  onAddAddress
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    type: "home" // 'home', 'work', 'other'
  });

  const [errors, setErrors] = useState({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setNewAddress({
      name: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      type: "home"
    });
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = ["name", "phone", "addressLine1", "city", "state", "postalCode"];
    
    requiredFields.forEach(field => {
      if (!newAddress[field] || newAddress[field].trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    if (newAddress.phone && !/^\d{10}$/.test(newAddress.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (newAddress.postalCode && !/^\d{6}$/.test(newAddress.postalCode)) {
      newErrors.postalCode = "Enter a valid 6-digit postal code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (validate()) {
      await onAddAddress(newAddress);
      handleClose();
    }
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case "home": return <HomeIcon color="primary" />;
      case "work": return <WorkIcon color="secondary" />;
      default: return <LocationIcon color="action" />;
    }
  };

  return (
    <Box mb={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600}>Shipping Address</Typography>
        <Button
          variant="outlined"
          startIcon={<AddLocationAltIcon />}
          onClick={handleOpen}
          sx={{ borderRadius: 2 }}
        >
          Add New Address
        </Button>
      </Box>

      <Grid container spacing={3}>
        {addresses.map((addr, idx) => (
          <Grid item xs={12} md={6} lg={4} key={idx}>
            <Card
              onClick={() => onSelect(idx)}
              sx={{
                border: selectedIndex === idx ? `2px solid ${theme.palette.primary.main}` : "1px solid #e0e0e0",
                borderRadius: 2,
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 3,
                  transform: "translateY(-2px)"
                },
                position: "relative",
                overflow: "visible"
              }}
            >
              {selectedIndex === idx && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "50%",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <CheckCircleIcon sx={{ color: "white", fontSize: 20 }} />
                </Box>
              )}
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Avatar sx={{ bgcolor: theme.palette.grey[100] }}>
                    {getAddressIcon(addr.type || "other")}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600} variant="subtitle1">
                      {addr.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {addr.phone}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" paragraph sx={{ mb: 1 }}>
                  {addr.addressLine1}
                  {addr.addressLine2 && `, ${addr.addressLine2}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {addr.city}, {addr.state} - {addr.postalCode}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {addr.country}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={6} lg={4}>
          <Card
            onClick={handleOpen}
            sx={{
              border: "2px dashed #e0e0e0",
              borderRadius: 2,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <AddLocationAltIcon
                color="primary"
                sx={{ fontSize: 40, mb: 1 }}
              />
              <Typography variant="subtitle1" color="primary">
                Add New Address
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click to add a new shipping address
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 2 }}>
          <Typography variant="h6" fontWeight={600}>Add New Address</Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box display="flex" gap={2} mb={3}>
            {["home", "work", "other"].map((type) => (
              <Button
                key={type}
                variant={newAddress.type === type ? "contained" : "outlined"}
                startIcon={getAddressIcon(type)}
                onClick={() => setNewAddress({ ...newAddress, type })}
                sx={{
                  textTransform: 'capitalize',
                  flex: 1,
                  borderRadius: 2,
                  py: 1.5
                }}
              >
                {type}
              </Button>
            ))}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Full Name"
                fullWidth
                size="small"
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                fullWidth
                size="small"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                error={!!errors.phone}
                helperText={errors.phone || "10-digit mobile number"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address Line 1"
                fullWidth
                size="small"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                error={!!errors.addressLine1}
                helperText={errors.addressLine1 || "Street address, P.O. box, company name"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address Line 2"
                fullWidth
                size="small"
                value={newAddress.addressLine2}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                helperText="Apartment, suite, unit, building, floor, etc."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="City"
                fullWidth
                size="small"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="State"
                fullWidth
                size="small"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                error={!!errors.state}
                helperText={errors.state}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Postal Code"
                fullWidth
                size="small"
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                error={!!errors.postalCode}
                helperText={errors.postalCode || "6-digit postal code"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                fullWidth
                size="small"
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ borderRadius: 1, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            sx={{ borderRadius: 1, px: 4 }}
          >
            Save Address
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressSelector;