/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";

export default function AdminLayout({ user, onLogout, children }) {
  return (
    <Box style={{ minHeight: "100vh", background: "#f8f9fa", display: "flex" }}>
      <Sidebar user={user} onLogout={onLogout} />
      <Box style={{ flex: 1, marginLeft: 240 }}>
        <Box component="main" style={{ padding: 32 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

