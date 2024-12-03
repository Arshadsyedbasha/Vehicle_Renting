import React, { useState } from 'react';
import {
  AppBar, Box, Toolbar, Typography, IconButton, Avatar, Button, Tooltip, MenuItem, Menu, Container, TextField, Grid, Stack, Alert
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Facebook from '@mui/icons-material/Facebook';
import Twitter from '@mui/icons-material/Twitter';
import Instagram from '@mui/icons-material/Instagram';
import LinkedIn from '@mui/icons-material/LinkedIn';
import MapComponent from './Map';
import Payment from './Payment';

// Pages for navigation
const pages = [
  { name: 'Home', link: '/ho' },
  { name: 'Why Us', link: '/wh' },
  { name: 'Rent Your Vehicle', link: '/ca' }
];

const settings = [
  { name: 'Profile', link: '/pp' },
  { name: 'Account', link: '#' },
  { name: 'Dashboard', link: '#' },
  { name: 'Logout', link: '/si' }
];

// ResponsiveAppBar Component
function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'cadetblue' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: 'flex',
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            RentMyRide
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
            {pages.map((page, index) => (
              <Button
                key={index}
                onClick={handleCloseNavMenu}
                component={Link}
                to={page.link}
                sx={{
                  my: 2, color: 'white', display: 'block',
                  '&:hover': { backgroundColor: 'lightgray', color: 'black' }
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src="https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem key={index} onClick={handleCloseUserMenu} component={Link} to={setting.link}>
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

// Footer Component
function Footer() {
  return (
    <Box sx={{ backgroundColor: 'cadetblue', color: 'white', py: 5, px: 3, mt: 5, textAlign: 'center' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>Contact Us</Typography>
          <Typography variant="body2">Email: birenting@gmail.com</Typography>
          <Typography variant="body2">Phone: (123) 456-7890</Typography>
          <Typography variant="body2">Address: 123 Lane, Coimbatore - 641008</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>Follow Us</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            {[
              { icon: <Facebook />, link: "https://www.facebook.com" },
              { icon: <Twitter />, link: "https://www.twitter.com" },
              { icon: <Instagram />, link: "https://www.instagram.com" },
              { icon: <LinkedIn />, link: "https://www.linkedin.com" }
            ].map((social, idx) => (
              <IconButton key={idx} color="inherit" href={social.link} target="_blank">
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>Subscribe to Our Newsletter</Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your email"
              sx={{
                input: { color: 'white' },
                mb: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
              }}
              InputProps={{
                style: { color: 'white' },
              }}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: 'white',
                color: 'cadetblue',
                '&:hover': { backgroundColor: 'lightgray' },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Typography variant="body2" sx={{ mt: 4 }}>
        © {new Date().getFullYear()} Vehicle Renting. All rights reserved.
      </Typography>
    </Box>
  );
}

// ConfirmationPage Component
function ConfirmationPage() {
  const location = useLocation();
  const { state } = location;
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [veaddress, setVeaddress] = useState(state?.veaddress || '');
  // const [drivingLicense,setDrivingLicense]=useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showMap, setShowMap] = useState(false); // Track whether to show the map or not
  const [errors, setErrors] = useState({
    name: false,
    phoneNumber: false,
    address: false,
    veaddress: false,
    drivingLicense: false,
    licenseExpiry: false,
    pickUpDate: false,
    dropDate: false,
  });
  const [drivingLicense, setDrivingLicense] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [pickUpDate, setPickUpDate] = useState('');
  const [dropDate, setDropDate] = useState('');

  const handleSubmit = async () => {
    const newErrors = {
      name: !name,
      phoneNumber: !phoneNumber,
      address: !address,
      veaddress: !veaddress,
      drivingLicense: !drivingLicense,
      licenseExpiry: !licenseExpiry,
      pickUpDate: !pickUpDate,
      dropDate: !dropDate,
    };

    if (Object.values(newErrors).includes(true)) {
      setErrors(newErrors);
      return;
    }

    const rentalDetail = {
      name,
      phoneNumber,
      address,
      veaddress,
      drivingLicense,
      licenseExpiry,
      pickUpDate,
      dropDate,
    };

    try {
      const response = await fetch('http://localhost:8080/api/rentals/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rentalDetail),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Rental confirmed:', data);
        setShowAlert(true);
        setShowMap(true); // Show map only after confirmation
      } else {
        console.error('Rental confirmation failed.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box
            sx={{
              flex: showMap ? 0.35 : 1,
              p: 3,
              boxShadow: 3,
              borderRadius: 2,
              mb: 3,
              backgroundColor: '#f5f5f5',
              transition: 'flex 0.3s',
              minWidth: showMap ? '300px' : 'auto',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Confirmation Page
            </Typography>
            {showAlert && (
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert variant="filled" severity="success">
                  The Renting has been confirmed.
                </Alert>
              </Stack>
            )}
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: false }));
                }}
                margin="normal"
                variant="outlined"
                error={errors.name}
                helperText={errors.name && "Name is required"}
              />
              <TextField
                label="Phone Number"
                fullWidth
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setErrors((prev) => ({ ...prev, phoneNumber: false }));
                }}
                margin="normal"
                variant="outlined"
                error={errors.phoneNumber}
                helperText={errors.phoneNumber && "Phone number is required"}
              />
              <TextField
                label="Your Address"
                fullWidth
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setErrors((prev) => ({ ...prev, address: false }));
                }}
                margin="normal"
                variant="outlined"
                error={errors.address}
                helperText={errors.address && "Address is required"}
              />
              <TextField
                label="Vehicle Address"
                fullWidth
                value={veaddress}
                onChange={(e) => {
                  setVeaddress(e.target.value);
                  setErrors((prev) => ({ ...prev, veaddress: false }));
                }}
                margin="normal"
                variant="outlined"
                error={errors.veaddress}
                helperText={errors.veaddress && "Pick Up Point is required"}
              />
              <TextField
                label="Driving License Number"
                fullWidth
                value={drivingLicense}
                onChange={(e) => {
                  setDrivingLicense(e.target.value);
                  setErrors((prev) => ({ ...prev, drivingLicense: false }));
                }}
                margin="normal"
                variant="outlined"
                error={errors.drivingLicense}
                helperText={errors.drivingLicense && "Driving License number is required"}
              />
              <TextField
                label="License Expiry Date"
                type="date"
                fullWidth
                value={licenseExpiry}
                onChange={(e) => {
                  setLicenseExpiry(e.target.value);
                  setErrors((prev) => ({ ...prev, licenseExpiry: false }));
                }}
                margin="normal"
                variant="outlined"
                error={errors.licenseExpiry}
                helperText={errors.licenseExpiry && "License expiry date is required"}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Pick Up Date"
                type="date"
                fullWidth
                value={pickUpDate}
                onChange={(e) => {
                  setPickUpDate(e.target.value);
                  setErrors((prev) => ({ ...prev, pickUpDate: false }));
                }}
                margin="normal"
                variant="outlined"
                error={errors.pickUpDate}
                helperText={errors.pickUpDate && "Pick up date is required"}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Drop Date"
                type="date"
                fullWidth
                value={dropDate}
                onChange={(e) => {
                  setDropDate(e.target.value);
                  setErrors((prev) => ({ ...prev, dropDate: false }));
                }}
                margin="normal"
                variant="outlined"
                error={errors.dropDate}
                helperText={errors.dropDate && "Drop date is required"}
                InputLabelProps={{ shrink: true }}
              />
              <Payment />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSubmit}
              >
                Confirm
              </Button>
            </Box>
          </Box>
          {showMap && (
            <Box sx={{ flex: 0.65, ml: 2, minWidth: '350px', transition: 'flex 0.3s' }}>
              <MapComponent startAddress={address} endAddress={veaddress} />
            </Box>
          )}
        </Box>
      </Container>
      <Footer />
    </>
  );
}

export default ConfirmationPage;
