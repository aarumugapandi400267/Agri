import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Typography, AppBar, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Avatar } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useDispatch } from "react-redux";
import ProductList from "../Product/ProductList";
import Profile from "../Profile/Profile";
import DashboardScreen from "./DashboardScreen";
import OrdersScreen from "../Order/FarmerOrderList";

// const OrdersScreen = () => <Typography variant="h4">Orders Management</Typography>;

export default function FarmerDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)"); // Detects mobile screen size
  const dispatch = useDispatch();

  const toggleSidebar = () => setMobileOpen(!mobileOpen);

  const NAVIGATION = [
    {
      title: "Profile",
      icon: (
        <Avatar src={JSON.parse(localStorage.getItem("profile"))?.image || ""}>
          {!JSON.parse(localStorage.getItem("profile"))?.image &&
            JSON.parse(localStorage.getItem("profile"))?.name.charAt(0)}
        </Avatar>
      ),
      component: <Profile />,
    },
    { title: "Dashboard", icon: <DashboardIcon />, component: <DashboardScreen /> },
    {
      title: "Products",
      icon: <ListAltIcon />,
      component: <ProductList dispatch={dispatch} />, // Pass dispatch to ProductList
    },
    { title: "Orders", icon: <ChecklistRtlIcon />, component: <OrdersScreen /> },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* AppBar for Mobile Navigation */}
      {isMobile && (
        <AppBar position="fixed" sx={{ bgcolor: "#2c3e50" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {activeTab}
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={toggleSidebar}
        sx={{
          width: isCollapsed ? 80 : 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isCollapsed ? 80 : 240,
            transition: "width 0.3s",
            overflowX: "hidden",
            bgcolor: "#2c3e50",
            color: "#fff",
          },
        }}
      >
        {!isMobile && (
          <Box sx={{ display: "flex", justifyContent: isCollapsed ? "center" : "flex-end", p: 1 }}>
            <IconButton onClick={() => setIsCollapsed(!isCollapsed)} sx={{ color: "#fff" }}>
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        <List>
          {NAVIGATION.map((item) => (
            <ListItem
              button
              key={item.title}
              onClick={() => {
                setActiveTab(item.title);
                if (isMobile) toggleSidebar();
              }}
              sx={{
                bgcolor: activeTab === item.title ? "#34495e" : "transparent",
                marginBottom: "5px",
                "&:hover": {
                  bgcolor: "#1f2b38",
                  cursor: "pointer",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
              {!isCollapsed && !isMobile && <ListItemText primary={item.title} />}
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin-left 0.3s",
          marginLeft: isMobile ? 0 : isCollapsed ? "80px" : "240px",
          marginTop: isMobile ? "64px" : 0,
        }}
      >
        {NAVIGATION.find((item) => item.title === activeTab)?.component}
      </Box>
    </Box>
  );
}