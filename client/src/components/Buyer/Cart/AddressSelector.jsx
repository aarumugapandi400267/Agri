import React, { useState } from "react";
import {
  Box, Typography, Card, CardContent, Grid, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const AddressSelector = ({
  addresses = [],
  selectedIndex,
  onSelect,
  onAddAddress
}) => {
  const [open, setOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India"
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAdd = async () => {
    if (Object.values(newAddress).every(val => val && val.trim() !== "")) {
      await onAddAddress(newAddress); // Await parent update
      setNewAddress({
        name: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India"
      });
      handleClose();
    } else {
      alert("Please fill all fields.");
    }
  };

  return (
    <Box mb={2}>
      <Typography variant="h6" mb={1}>Shipping Address</Typography>
      <Grid container spacing={2}>
        {addresses.map((addr, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Card
              variant={selectedIndex === idx ? "outlined" : "elevation"}
              sx={{
                borderColor: selectedIndex === idx ? "primary.main" : "grey.300",
                boxShadow: selectedIndex === idx ? 2 : 0,
                cursor: "pointer"
              }}
              onClick={() => onSelect(idx)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  {selectedIndex === idx && (
                    <CheckCircleIcon color="primary" fontSize="small" />
                  )}
                  <Typography fontWeight={600}>{addr.name}</Typography>
                  <Typography variant="body2" color="text.secondary">({addr.phone})</Typography>
                </Box>
                <Typography variant="body2">
                  {addr.addressLine1}, {addr.addressLine2 && addr.addressLine2 + ", "}
                  {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderColor: "grey.300",
              boxShadow: 0,
              cursor: "pointer",
              minHeight: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={handleOpen}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <AddLocationAltIcon color="primary" />
              <Typography>Add New Address</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={1} mt={1}>
            <TextField label="Name" size="small" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} />
            <TextField label="Phone" size="small" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} />
            <TextField label="Address Line 1" size="small" value={newAddress.addressLine1} onChange={e => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />
            <TextField label="Address Line 2" size="small" value={newAddress.addressLine2} onChange={e => setNewAddress({ ...newAddress, addressLine2: e.target.value })} />
            <TextField label="City" size="small" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
            <TextField label="State" size="small" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />
            <TextField label="Postal Code" size="small" value={newAddress.postalCode} onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })} />
            <TextField label="Country" size="small" value={newAddress.country} onChange={e => setNewAddress({ ...newAddress, country: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleAdd} variant="contained" color="primary">Add Address</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressSelector;