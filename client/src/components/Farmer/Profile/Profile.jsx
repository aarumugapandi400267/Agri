import React, { useState, useEffect } from "react";
import { updateUser, getUser } from "../../../actions/user";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import { createAccount } from "../../../actions/order";

export default function Profile() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editProfile, setEditProfile] = useState({
    name: "",
    email: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [account, setAccount] = useState(null);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [accountForm, setAccountForm] = useState({
    bankName: "",
    accountNumber: "",
    ifsc: "",
    holderName: "",
    phone: "",
  });
  const [accountLoading, setAccountLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await dispatch(getUser());
        setAccount(data.bankDetails || null);
        setProfile(data);
        setEditProfile(data);
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.message || "Failed to fetch profile",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [dispatch]);

  const handleOpen = () => {
    setEditProfile(profile);
    setPreviewImage(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPreviewImage(null);
  };

  const handleChange = (e) => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditProfile({ ...editProfile, image: e.target.files[0] });
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("name", editProfile.name);
      formData.append("email", editProfile.email);
      if (editProfile.image) {
        formData.append("profileImage", editProfile.image);
      }
      const updated = await dispatch(updateUser(formData));
      setProfile(updated);
      setOpen(false);
      setPreviewImage(null);
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to update profile",
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle open/close
  const handleAccountOpen = () => {
    setAccountForm({
      bankName: account?.bankName || "",
      accountNumber: account?.accountNumber || "",
      ifsc: account?.ifsc || "",
      holderName: account?.accountHolderName || "",
      phone: account?.phone || "",
    });
    setAccountDialogOpen(true);
  };
  const handleAccountClose = () => setAccountDialogOpen(false);

  // Handle form change
  const handleAccountChange = (e) => {
    setAccountForm({ ...accountForm, [e.target.name]: e.target.value });
  };

  // Handle save
  const handleAccountSave = async () => {
    setAccountLoading(true);
    try {
      const payload = {
        ...accountForm,
        contact: accountForm.phone,
        email: profile?.email,
        holderName: accountForm.holderName,
      };
      await dispatch(createAccount(payload));
      // Fetch updated user data after account creation
      const updated = await dispatch(getUser());
      setProfile(updated);
      setAccount(updated.bankDetails || null);
      setSnackbar({
        open: true,
        message: "Account details saved!",
        severity: "success",
      });
      setAccountDialogOpen(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    } finally {
      setAccountLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#f5f5f5",
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#4CAF50" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: { xs: "#f5f7fa", md: "#f5f7fa" },
        py: { xs: 2, md: 5 },
        px: { xs: 1, sm: 2 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 450,
          mx: "auto",
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          textAlign: "center",
          background: "linear-gradient(135deg, #f9f9f9 60%, #e8f5e9 100%)",
          boxShadow: "0 8px 24px rgba(76,175,80,0.10)",
        }}
      >
        <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
          <Avatar
            src={profile?.profileImage || ""}
            sx={{
              width: { xs: 90, sm: 120 },
              height: { xs: 90, sm: 120 },
              mx: "auto",
              mb: 2,
              backgroundColor: "#4CAF50",
              fontSize: 36,
              border: "3px solid #ffffff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            {!profile?.profileImage && profile?.name[0]?.toUpperCase()}
          </Avatar>
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: 10,
              right: 10,
              bgcolor: "#4CAF50",
              color: "white",
              "&:hover": { bgcolor: "#388E3C" },
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              width: 36,
              height: 36,
            }}
          >
            <PhotoCameraIcon fontSize="small" />
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </IconButton>
        </Box>

        <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600, mb: 1 }}>
          {profile.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontSize: { xs: "0.95rem", sm: "1rem" } }}>
          {profile.email}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            px: 2,
            py: 1,
            bgcolor: "#4CAF50",
            color: "#fff",
            display: "inline-block",
            borderRadius: "16px",
            fontWeight: "bold",
            textTransform: "capitalize",
            fontSize: { xs: "0.85rem", sm: "1rem" },
          }}
        >
          {profile.role}
        </Typography>

        <Divider sx={{ my: { xs: 2, sm: 3 } }} />

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              bgcolor: "#4CAF50",
              px: { xs: 2, sm: 4 },
              py: 1,
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "none",
              fontSize: { xs: "0.95rem", sm: "1rem" },
              width: { xs: "100%", sm: "auto" },
              "&:hover": { bgcolor: "#388E3C", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" },
            }}
            onClick={handleOpen}
          >
            Edit Profile
          </Button>
        </Box>
      </Paper>

      {/* Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: "100%",
            maxWidth: 400,
            mx: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "1.3rem",
            bgcolor: "#f5f5f5",
          }}
        >
          Edit Profile
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar
              src={previewImage || profile?.profileImage || ""}
              sx={{
                width: 90,
                height: 90,
                mx: "auto",
                mb: 2,
                backgroundColor: "#4CAF50",
                fontSize: 36,
                border: "3px solid #ffffff",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              {!previewImage && !profile?.profileImage && editProfile.name[0]?.toUpperCase()}
            </Avatar>
            <Button
              component="label"
              variant="outlined"
              startIcon={<PhotoCameraIcon />}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                borderColor: "#4CAF50",
                color: "#4CAF50",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                "&:hover": {
                  borderColor: "#388E3C",
                  backgroundColor: "rgba(76, 175, 80, 0.08)",
                },
              }}
            >
              Change Photo
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
          </Box>

          <TextField
            label="Name"
            name="name"
            value={editProfile.name || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: "8px" },
            }}
          />
          <TextField
            label="Email"
            name="email"
            value={editProfile.email || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: "8px" },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleClose}
            color="error"
            variant="outlined"
            sx={{
              borderRadius: "8px",
              fontWeight: 600,
              px: 3,
              width: { xs: "50%", sm: "auto" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={updating}
            sx={{
              bgcolor: "#4CAF50",
              borderRadius: "8px",
              fontWeight: 600,
              px: 3,
              width: { xs: "50%", sm: "auto" },
              "&:hover": { bgcolor: "#388E3C" },
            }}
            startIcon={updating ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
          >
            {updating ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Account Details Section */}
      <Divider sx={{ my: { xs: 2, sm: 3 }, width: "100%", maxWidth: 450 }} />

      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: 450,
          mx: "auto",
          p: { xs: 2, sm: 3 },
          borderRadius: 4,
          bgcolor: "#f7faf7",
          mt: 2,
        }}
      >
        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              fontSize: { xs: "1.05rem", sm: "1.15rem" },
            }}
          >
            <AccountBalanceIcon sx={{ mr: 1, color: "#4CAF50" }} />
            Account Details
          </Typography>
          {accountLoading ? (
            <CircularProgress size={24} />
          ) : account ? (
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <b>Bank:</b> {account.bankName}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <b>Account #:</b> {account.accountNumber}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <b>IFSC:</b> {account.ifsc}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <b>Holder:</b> {account.accountHolderName}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <b>Phone:</b> {account.contact}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  width: { xs: "100%", sm: "auto" },
                  fontWeight: 600,
                }}
                onClick={handleAccountOpen}
              >
                Edit Account
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 2,
                bgcolor: "#4CAF50",
                width: { xs: "100%", sm: "auto" },
                fontWeight: 600,
                "&:hover": { bgcolor: "#388E3C" },
              }}
              onClick={handleAccountOpen}
            >
              Add Account
            </Button>
          )}
        </Box>
      </Paper>

      {/* Account Dialog */}
      <Dialog
        open={accountDialogOpen}
        onClose={handleAccountClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3, width: "100%", maxWidth: 400, mx: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>Account Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Bank Name"
            name="bankName"
            value={accountForm.bankName}
            onChange={handleAccountChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{ sx: { borderRadius: "8px" } }}
          />
          <TextField
            label="Account Number"
            name="accountNumber"
            value={accountForm.accountNumber}
            onChange={handleAccountChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{ sx: { borderRadius: "8px" } }}
          />
          <TextField
            label="IFSC Code"
            name="ifsc"
            value={accountForm.ifsc}
            onChange={handleAccountChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{ sx: { borderRadius: "8px" } }}
          />
          <TextField
            label="Account Holder Name"
            name="holderName"
            value={accountForm.holderName}
            onChange={handleAccountChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{ sx: { borderRadius: "8px" } }}
          />
          <TextField
            label="Phone Number"
            name="phone"
            value={accountForm.phone}
            onChange={handleAccountChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{ sx: { borderRadius: "8px" } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleAccountClose}
            color="error"
            variant="outlined"
            sx={{
              borderRadius: "8px",
              fontWeight: 600,
              px: 3,
              width: { xs: "50%", sm: "auto" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAccountSave}
            color="primary"
            variant="contained"
            disabled={accountLoading}
            sx={{
              bgcolor: "#4CAF50",
              borderRadius: "8px",
              fontWeight: 600,
              px: 3,
              width: { xs: "50%", sm: "auto" },
              "&:hover": { bgcolor: "#388E3C" },
            }}
          >
            {accountLoading ? <CircularProgress size={20} color="inherit" /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}