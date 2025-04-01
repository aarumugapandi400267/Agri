import React, { useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export default function Profile() {
  const storedProfile = JSON.parse(localStorage.getItem("profile")) || {
    name: "Pandi",
    email: "aaru@g.c",
    role: "Farmer",
    image: null,
  };

  const [profile, setProfile] = useState(storedProfile);
  const [open, setOpen] = useState(false);
  const [editProfile, setEditProfile] = useState(storedProfile);

  const handleOpen = () => {
    setEditProfile(profile);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfile({ ...editProfile, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem("profile", JSON.stringify(editProfile));
    setProfile(editProfile);
    setOpen(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        mx: "auto",
        p: 3,
        mt: 5,
        borderRadius: 3,
        textAlign: "center",
        background: "#fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
        <Avatar
          src={profile.image || ""}
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2,
            backgroundColor: "#4CAF50",
            fontSize: 24,
          }}
        >
          {!profile.image && profile.name[0]}
        </Avatar>
        <IconButton
          component="label"
          sx={{
            position: "absolute",
            bottom: 5,
            right: 5,
            bgcolor: "rgba(255,255,255,0.8)",
            "&:hover": { bgcolor: "rgba(255,255,255,1)" },
          }}
        >
          <PhotoCameraIcon fontSize="small" />
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
        </IconButton>
      </Box>

      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
        {profile.name}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {profile.email}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mt: 1,
          px: 2,
          py: 0.5,
          bgcolor: "#4CAF50",
          color: "#fff",
          display: "inline-block",
          borderRadius: "10px",
          fontWeight: "bold",
        }}
      >
        {profile.role}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          sx={{
            bgcolor: "#4CAF50",
            "&:hover": { bgcolor: "#388E3C" },
          }}
          onClick={handleOpen}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Edit Profile Popup */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Avatar
              src={editProfile.image || ""}
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 1,
                backgroundColor: "#4CAF50",
                fontSize: 24,
              }}
            >
              {!editProfile.image && editProfile.name[0]}
            </Avatar>
            <Button component="label" variant="outlined" startIcon={<PhotoCameraIcon />}>
              Upload Image
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
          </Box>

          <TextField
            label="Name"
            name="name"
            value={editProfile.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={editProfile.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
