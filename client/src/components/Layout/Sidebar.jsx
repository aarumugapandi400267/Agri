import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
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
    <Drawer variant="permanent">
      <div style={{ padding: 24, paddingBottom: 0, display: "flex", alignItems: "center" }}>
        <Avatar
          sx={{ bgcolor: "#43a047", width: 40, height: 40, fontWeight: 700 }}
        >
          FM
        </Avatar>
        <Typography
          variant="h6"
          sx={{ ml: 2, fontWeight: 700, color: "#1976d2" }}
        >
          FARKIT
        </Typography>
      </div>
      <Divider style={{ margin: "16px 0" }} />
      <div>
        {navItems.map((section, idx) => (
          <div key={idx}>
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
          </div>
        ))}
      </div>
      <div style={{ padding: 16, borderTop: "1px solid #eee" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar src={user?.profileImage} sx={{ width: 36, height: 36, mr: 1 }}>
            {user?.name?.[0] || <AccountCircleIcon />}
          </Avatar>
          <div>
            <Typography variant="body2" fontWeight={600}>
              {user?.name || "Admin"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Administrator
            </Typography>
          </div>
          <Button
            onClick={onLogout}
            style={{ marginLeft: "auto" }}
            title="Logout"
          >
            <LogoutIcon />
          </Button>
        </div>
      </div>
    </Drawer>
  );
}