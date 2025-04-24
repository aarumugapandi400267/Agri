import React from 'react';
import { FaUsers, FaTachometerAlt, FaMoneyCheckAlt, FaBars } from 'react-icons/fa';

const Sidebar = ({ sidebarOpen, handleToggle }) => {
  const sidebarStyle = {
    background: '#1e1e2f',
    color: '#fff',
    padding: '20px 10px',
    transition: 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: sidebarOpen ? 'flex-start' : 'center',
    justifyContent: 'flex-start',
    boxShadow: '2px 0 12px rgba(0,0,0,0.1)',
    width: sidebarOpen ? '240px' : '70px',
    minHeight: '100vh',
  };

  const toggleBtnStyle = {
    fontSize: '20px',
    alignSelf: sidebarOpen ? 'flex-end' : 'center',
    cursor: 'pointer',
    marginBottom: '30px',
  };

  const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: sidebarOpen ? '15px' : '0',
    padding: '12px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    color: '#f1f1f1',
    marginBottom: '15px',
    backgroundColor: 'transparent',
    fontSize: '16px',
    justifyContent: sidebarOpen ? 'flex-start' : 'center',
  };

  const iconStyle = {
    fontSize: '20px',
    marginRight: sidebarOpen ? '15px' : '0',
  };

  return (
    <div style={sidebarStyle}>
      <div style={toggleBtnStyle} onClick={handleToggle}>
        <FaBars />
      </div>
      <div style={menuItemStyle}><FaTachometerAlt style={iconStyle} />{sidebarOpen && 'Dashboard'}</div>
      <div style={menuItemStyle}><FaUsers style={iconStyle} />{sidebarOpen && 'User Management'}</div>
      <div style={menuItemStyle}><FaMoneyCheckAlt style={iconStyle} />{sidebarOpen && 'Payment Approval'}</div>
      <div style={menuItemStyle}><FaMoneyCheckAlt style={iconStyle} />{sidebarOpen && 'Balance'}</div>
    </div>
  );
};

export default Sidebar;
