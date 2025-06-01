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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Profile() {
  const dispatch = useDispatch();
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await dispatch(getUser());
        setProfile(data);
        setEditProfile(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setSnackbar({
          open: true,
          message: "Failed to load profile data",
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
      console.error("Update failed:", err);
      setSnackbar({
        open: true,
        message: "Failed to update profile",
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#4CAF50" }} />
      </Box>
    );
  }

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 450,
          mx: "auto",
          p: 4,
          mt: { xs: 2, md: 5 },
          borderRadius: 3,
          textAlign: "center",
          background: "linear-gradient(to bottom, #f9f9f9, #ffffff)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
          <Avatar
            src={profile?.profileImage || ""}
            sx={{
              width: 120,
              height: 120,
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
            }}
          >
            <PhotoCameraIcon fontSize="small" />
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </IconButton>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {profile.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
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
          }}
        >
          {profile.role}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              bgcolor: "#4CAF50",
              px: 4,
              py: 1,
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "none",
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
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: "100%",
            maxWidth: "500px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "1.5rem",
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
                width: 100,
                height: 100,
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
              "&:hover": { bgcolor: "#388E3C" },
            }}
            startIcon={updating ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
          >
            {updating ? "Saving..." : "Save Changes"}
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
    </>
  );
}