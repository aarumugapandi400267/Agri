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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export default function Profile() {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({
    name: "",
    email: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null); // for preview only

  useEffect(() => {
    dispatch(getUser())
      .then((data) => {
        setProfile(data);
        setEditProfile(data);
      })
      .catch((err) => console.error("Failed to fetch user:", err));
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
    setEditProfile({ ...editProfile, image: e.target.files[0] });
    console.log(editProfile)
    setPreviewImage(URL.createObjectURL(e.target.files[0])); // show preview
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", editProfile.name);
    formData.append("email", editProfile.email);
    if (editProfile.image) {
      formData.append("profileImage", editProfile.image);
    }

    // Iterate over FormData and log each entry
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    dispatch(updateUser(formData))
      .then((updated) => {
        setProfile(updated);
        setOpen(false);
        setPreviewImage(null);
      })
      .catch((err) => console.error("Update failed:", err));
  };


  if (!profile) return <Typography>Loading...</Typography>;

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
          src={profile?.profileImage || ""}
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2,
            backgroundColor: "#4CAF50",
            fontSize: 24,
          }}
        >
          {!profile?.profileImage && profile?.name[0]}
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

      {/* Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Avatar
              src={previewImage || profile?.profileImage || ""}
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 1,
                backgroundColor: "#4CAF50",
                fontSize: 24,
              }}
            >
              {!previewImage && !profile?.profileImage && editProfile.name[0]}
            </Avatar>
            <Button component="label" variant="outlined" startIcon={<PhotoCameraIcon />}>
              Upload Image
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
          />
          {/* <TextField
            label="Email"
            name="email"
            value={editProfile.email || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          /> */}
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
