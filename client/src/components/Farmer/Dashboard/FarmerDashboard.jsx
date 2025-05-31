import React, { useRef, useEffect } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Typography, AppBar, Toolbar, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useMediaQuery } from "@mui/material";
import { useDispatch } from "react-redux";
import ProductList from "../Product/ProductList";
import Profile from "../Profile/Profile";
import DashboardScreen from "./DashboardScreen";
import OrdersScreen from "../Order/FarmerOrderList";

export default function FarmerDashboard() {
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();

  // NAVIGATION config
  const NAVIGATION = [
    {
      title: "Profile",
      icon: (
        <Avatar src={JSON.parse(localStorage.getItem("profile"))?._doc?.image || ""}>
          {!JSON.parse(localStorage.getItem("profile"))?._doc?.image &&
            JSON.parse(localStorage.getItem("profile"))?._doc?.name?.charAt(0)}
        </Avatar>
      ),
      component: <Profile />,
    },
    { title: "Dashboard", icon: <DashboardIcon />, component: <DashboardScreen /> },
    {
      title: "Products",
      icon: <ListAltIcon />,
      component: <ProductList dispatch={dispatch} />,
    },
    { title: "Orders", icon: <ChecklistRtlIcon />, component: <OrdersScreen /> },
  ];

  // Use ref for activeTab, and force update with dummy state
  const activeTabRef = useRef(localStorage.getItem("farmerActiveTab") || "Dashboard");
  const [, forceUpdate] = React.useState(0);

  // Function to change tab and persist in localStorage
  const changeTab = (tabTitle) => {
    localStorage.setItem("farmerActiveTab", tabTitle);
    activeTabRef.current = tabTitle;
    forceUpdate((n) => n + 1);
  };

  // On mount, sync with localStorage
  useEffect(() => {
    const stored = localStorage.getItem("farmerActiveTab");
    if (stored && stored !== activeTabRef.current) {
      activeTabRef.current = stored;
      forceUpdate((n) => n + 1);
    }
    // eslint-disable-next-line
  }, []);

  const toggleSidebar = () => setMobileOpen(!mobileOpen);

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
              {activeTabRef.current}
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
                changeTab(item.title);
                if (isMobile) toggleSidebar();
              }}
              sx={{
                bgcolor: activeTabRef.current === item.title ? "#34495e" : "transparent",
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
        {NAVIGATION.find((item) => item.title === activeTabRef.current)?.component}
      </Box>
    </Box>
  );
}