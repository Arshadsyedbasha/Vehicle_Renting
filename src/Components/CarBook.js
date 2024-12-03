import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, AppBar, Toolbar, IconButton, Avatar, Tooltip, Menu, MenuItem, Grid, Alert, CircularProgress } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { keyframes } from '@mui/system';
import axios from 'axios';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

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
    <AppBar position="static" sx={{ backgroundColor: 'black' }}>
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
                  '&:hover': { backgroundColor: 'lightgray', color: 'blue' }
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

const CarBook = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    number: '',
    plate: '',
    email: '',
    url: '',
    price: '',
    address: '',
    mileage: '', // Add mileage to form state
    seats: '', // Add seats to form state
  });

  const [error, setError] = useState(null);
  const [successAlert, setSuccessAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (error) {
      setError(null);
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.number || !formData.plate || !formData.email || !formData.price || !formData.address || !formData.mileage || !formData.seats) {
      setError('All fields are required.');
      return;
    }

    if (!imageFile) {
      setError('Please upload an image.');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price)) {
      setError('Invalid price format.');
      return;
    }

    const mileage = parseFloat(formData.mileage);
    if (isNaN(mileage)) {
      setError('Invalid mileage format.');
      return;
    }

    const seats = parseInt(formData.seats);
    if (isNaN(seats)) {
      setError('Invalid seats format.');
      return;
    }

    setLoading(true);

    try {
      const formDataToUpload = new FormData();
      formDataToUpload.append('file', imageFile);
      formDataToUpload.append('upload_preset', 'vehicle_renting');

      const uploadResponse = await axios.post('https://api.cloudinary.com/v1_1/vehiclerenting/image/upload', formDataToUpload);

      const imageUrl = uploadResponse.data.secure_url;

      const formattedData = {
        ...formData,
        url: imageUrl,
        price: price,
        mileage: mileage, // Include mileage in the data
        seats: seats, // Include seats in the data
      };

      const response = await fetch('http://localhost:8080/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Vehicle added successfully:', data);
        setSuccessAlert(true);
        setFormData({ name: '', description: '', number: '', plate: '', email: '', url: '', price: '', address: '', mileage: '', seats: '' });
        setImageFile(null);
        setTimeout(() => setSuccessAlert(false), 3000);
      } else {
        console.error('Failed to add vehicle:', data);
        setError('Failed to add vehicle. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ResponsiveAppBar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {successAlert && <Alert severity="success">Vehicle added successfully!</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box
          sx={{
            mt: 4,
            animation: `${fadeIn} 1s ease-in-out`,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              transform: 'scale(1.01)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
            Add Your Car
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Existing form fields */}
            <TextField
              label="Owner Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              fullWidth
              value={formData.description}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              label="Phone Number"
              name="number"
              fullWidth
              value={formData.number}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              label="Car Number Plate"
              name="plate"
              fullWidth
              value={formData.plate}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              margin="normal"
            />
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Typography>Upload Image:</Typography>
              </Grid>
              <Grid item>
                <Button variant="contained" component="label">
                  Choose File
                  <input type="file" hidden onChange={handleImageChange} />
                </Button>
              </Grid>
              <Grid item>{imageFile && <Typography>{imageFile.name}</Typography>}</Grid>
            </Grid>
            <TextField
              label="Mileage"
              name="mileage"
              fullWidth
              value={formData.mileage}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              label="No of seats"
              name="seats"
              fullWidth
              value={formData.seats}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              label="Price per Day"
              name="price"
              fullWidth
              value={formData.price}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              label="Address"
              name="address"
              fullWidth
              value={formData.address}
              onChange={handleChange}
              margin="normal"
            />
            
            
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
      <Footer /> {/* Updated footer component */}
    </div>
  );
};

function Footer() {
  return (
    <Box sx={{ backgroundColor: 'black', color: 'white', py: 5, px: 3, mt: 5, textAlign: 'center' }}>
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


export default CarBook;
