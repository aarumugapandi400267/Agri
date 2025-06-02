import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

const navItems = [
  {
    section: "Dashboard",
    items: [
      {
        title: "Dashboard",
        icon: <DashboardIcon />,
        path: "/admin/dashboard",
      },
    ],
  },
  {
    section: "Management",
    items: [
      {
        title: "User Management",
        icon: <PeopleAltIcon />,
        path: "/admin/users",
      },
      {
        title: "Product Approval",
        icon: <Inventory2Icon />,
        path: "/admin/products",
      },
      {
        title: "Analytics",
        icon: <BarChartIcon />,
        path: "/admin/analytics",
      },
      {
        title: "Reports",
        icon: <DescriptionIcon />,
        path: "/admin/export",
      },
    ],
  },
  {
    section: "Settings",
    items: [
      {
        title: "General Settings",
        icon: <SettingsIcon />,
        path: "/admin/settings",
      },
      {
        title: "Profile",
        icon: <AccountCircleIcon />,
        path: "/admin/profile",
      },
    ],
  },
];

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          background: "#fff",
          borderRight: "1px solid #e0e0e0",
        },
        display: { xs: "none", md: "block" },
      }}
      open
    >
      <Box sx={{ p: 3, pb: 0, display: "flex", alignItems: "center" }}>
        <Avatar sx={{ bgcolor: "#43a047", width: 40, height: 40, fontWeight: 700 }}>
          FM
        </Avatar>
        <Typography variant="h6" sx={{ ml: 2, fontWeight: 700, color: "#1976d2" }}>
          FARKIT
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ flexGrow: 1 }}>
        {navItems.map((section, idx) => (
          <Box key={idx} sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              sx={{ pl: 3, color: "#888", fontWeight: 600, letterSpacing: 1 }}
            >
              {section.section}
            </Typography>
            <List>
              {section.items.map((item, i) => (
                <ListItem key={i} disablePadding>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      color: location.pathname === item.path ? "#1976d2" : "#333",
                      background: location.pathname === item.path ? "#e3f2fd" : "inherit",
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src={user?.profileImage} sx={{ width: 36, height: 36, mr: 1 }}>
            {user?.name?.[0] || <AccountCircleIcon />}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {user?.name || "Admin"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Administrator
            </Typography>
          </Box>
          <Button
            onClick={onLogout}
            sx={{ ml: "auto", minWidth: 0, color: "#888" }}
            title="Logout"
          >
            <LogoutIcon />
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}