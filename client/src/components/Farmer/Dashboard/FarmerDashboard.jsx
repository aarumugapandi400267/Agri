import React, { useRef, useEffect } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Typography, AppBar, Toolbar, Avatar, Grid, Card, CardContent } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "../Product/ProductList";
import Profile from "../Profile/Profile";
import DashboardScreen from "./DashboardScreen";
import OrdersScreen from "../Order/FarmerOrderList";
import { fetchOrders } from "../../../actions/user"; // Adjust import based on your actions file
import { getUser } from "../../../actions/user"; // Adjust import based on your actions file

// Example: selector or fetch logic for orders
// Replace with your actual Redux selector or fetching logic
// Here, assuming orders are in state.ordersReducer.orders
export default function FarmerDashboard() {
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();

  // Get orders from Redux (adjust selector as per your store)
  const orders = useSelector(state => state.farmerReducer?.orders || []);

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const deliveredOrders = orders.filter(o => o.status === "Delivered").length;
  const cancelledOrders = orders.filter(o => o.status === "Cancelled").length;

  const profileImage = JSON.parse(localStorage.getItem("profile"))?.user?.profileImage || "";
  // NAVIGATION config
  const NAVIGATION = [
    {
      title: "Profile",
      icon: (
        <Avatar src={profileImage}>
          {!JSON.parse(localStorage.getItem("profile"))?.user?.image &&
            JSON.parse(localStorage.getItem("profile"))?.user?.name?.charAt(0)}
        </Avatar>
      ),
      component: <Profile />,
    },
    {
      title: "Dashboard",
      icon: <DashboardIcon />,
      component: (
        <Box>
          <DashboardScreen />
          {/* Statistics Cards */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Card sx={{ bgcolor: "#f5f8fa" }}>
                  <CardContent>
                    <Typography variant="h4" color="primary" fontWeight={700}>{totalOrders}</Typography>
                    <Typography color="text.secondary">Total Orders</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ bgcolor: "#f5f8fa" }}>
                  <CardContent>
                    <Typography variant="h4" color="primary" fontWeight={700}>₹{totalRevenue}</Typography>
                    <Typography color="text.secondary">Total Revenue</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ bgcolor: "#fffde7" }}>
                  <CardContent>
                    <Typography variant="h4" color="warning.main" fontWeight={700}>{pendingOrders}</Typography>
                    <Typography color="text.secondary">Pending Orders</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ bgcolor: "#e8f5e9" }}>
                  <CardContent>
                    <Typography variant="h4" color="success.main" fontWeight={700}>{deliveredOrders}</Typography>
                    <Typography color="text.secondary">Delivered Orders</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ bgcolor: "#ffebee" }}>
                  <CardContent>
                    <Typography variant="h4" color="error.main" fontWeight={700}>{cancelledOrders}</Typography>
                    <Typography color="text.secondary">Cancelled Orders</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      ),
    },
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
    dispatch(fetchOrders("farmer"))
    dispatch(getUser());
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