import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

const isTokenExpired = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decodedToken.exp < currentTime;
    } catch (error) {
        return true;
    }
};

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
        return <Navigate to="/auth" />;
    }
    return children;
};

export default ProtectedRoute;