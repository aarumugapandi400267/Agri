  import React, { useState } from 'react';
  import Sidebar from './Components/Sidebar';
  import Dashboard from './Components/Dashboard';
  import { motion } from 'framer-motion';

  const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const handleToggle = () => setSidebarOpen(!sidebarOpen);

    const containerStyle = {
      display: 'flex',
      height: '100vh',
      fontFamily: 'Poppins, sans-serif',
      background: 'linear-gradient(to right, #f8f9fa, #e9ecef)',
    };

    return (
      <motion.div
        style={containerStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Sidebar sidebarOpen={sidebarOpen} handleToggle={handleToggle} />
        <Dashboard />
      </motion.div>
    );
  };

  export default AdminDashboard;
