import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../../../actions/customer/user';

import HomePage from "../Home/Home"
import CartPage from '../Cart/Cart';
import ProfilePage from '../Profile/Profile';

import {
  Container,
  Typography,
  TextField,
  Box,
  InputAdornment,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [navValue, setNavValue] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts())
      .then(result => setProducts(result))
      .catch(error => console.log(error));
  }, [dispatch]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Navigation items with components
  const navItems = [
    {
      label: 'Home',
      icon: <HomeIcon />,
      component: <HomePage products={filteredProducts} />,
      searchable: true,
    },
    {
      label: 'Cart',
      icon: <ShoppingCartIcon />,
      component: <CartPage />,
      searchable: false,
    },
    {
      label: 'Profile',
      icon: <AccountCircleIcon />,
      component: <ProfilePage />,
      searchable: false,
    },
  ];

  const currentNav = navItems[navValue];

  return (
    <Container maxWidth="lg" sx={{ mt: 6, pb: 8 }}>
      <Box display="flex" flexDirection="column" gap={3}>
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          color="primary"
        >
          {currentNav.label}
        </Typography>

        {/* Search only on searchable pages */}
        {currentNav.searchable && (
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f9f9f9',
            }}
          >
            <TextField
              fullWidth
              placeholder="Search for fresh produce, grains, etc..."
              variant="standard"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mx: 1,
                fontSize: '1.1rem',
                input: {
                  p: 1,
                },
              }}
            />
          </Paper>
        )}
      </Box>

      {/* Render the selected page component */}
      {currentNav.component}

      {/* Bottom Navigation */}
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          value={navValue}
          onChange={(event, newValue) => setNavValue(newValue)}
          showLabels
        >
          {navItems.map((item, index) => (
            <BottomNavigationAction
              key={index}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Container>
  );
}
