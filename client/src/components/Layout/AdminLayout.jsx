import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import { getAnalytics } from "../../api/adminapi";

export default function AdminLayout({ user, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width:900px)");

  const handleToggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa", display: "flex" }}>
      {/* Desktop Sidebar */}
      {isDesktop && (
        <Sidebar user={user} onLogout={onLogout} />
      )}

      {/* Mobile Sidebar */}
      {!isDesktop && (
        <Drawer
          open={sidebarOpen}
          onClose={handleToggleSidebar}
          variant="temporary"
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": { width: 240 },
            display: { xs: "block", md: "none" },
          }}
        >
          <Sidebar user={user} onLogout={onLogout} />
        </Drawer>
      )}

      {/* Main Content */}
      <Box sx={{ flex: 1, ml: { md: "240px" }, display: "flex", flexDirection: "column" }}>
        {/* You can add a Navbar here if needed */}
        <Box component="main" sx={{ p: { xs: 2, md: 4 }, flex: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

