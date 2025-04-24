import React from 'react';

const Dashboard = () => {
  const contentStyle = {
    flexGrow: 1,
    padding: '40px',
    overflowY: 'auto',
  };

  const headerStyle = {
    fontSize: '28px',
    marginBottom: '30px',
    color: '#343a40',
  };

  const cardsStyle = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '40px',
  };

  const cardStyle = {
    flex: '1 1 300px',
    background: '#fff',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    textAlign: 'center',
  };

  const cardTitleStyle = {
    fontSize: '18px',
    color: '#6c757d',
    marginBottom: '10px',
  };

  const cardValueStyle = {
    fontSize: '32px',
    fontWeight: 600,
    color: '#212529',
  };

  return (
    <div style={contentStyle}>
      <div style={headerStyle}>Admin Dashboard</div>
      <div style={cardsStyle}>
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Total Users</div>
          <div style={cardValueStyle}>120</div>
        </div>
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Active Users</div>
          <div style={cardValueStyle}>98</div>
        </div>
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Payments</div>
          <div style={cardValueStyle}>$14,500</div>
        </div>
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Current Balance</div>
          <div style={cardValueStyle}>$2,350</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
