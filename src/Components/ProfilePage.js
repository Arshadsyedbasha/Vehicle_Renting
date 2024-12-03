import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Avatar,
  Snackbar,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { Link } from 'react-router-dom';

const pages = [
  { name: 'Home', link: '/ho' },
  { name: 'My Rides' },
  { name: 'Rent Your Vehicle', link: '/ca' },
];
const settings = [
  { name: 'Profile', link: '/profile' },
  { name: 'Logout', link: '/logout' },
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
    <AppBar position="static" sx={{ backgroundColor: '#1c4e80' }}>
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

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', avatar: '' });
  const [alertOpen, setAlertOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      navigate('/signin');
    } else {
      fetchUserProfile(email);
      fetchUserVehicles(email);
    }
  }, [navigate]);

  const fetchUserProfile = async (email) => {
    try {
      const response = await fetch(`http://localhost:8080/user/${email}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setFormData({ name: userData.name, email: userData.email, password: userData.password, avatar: userData.avatar });
      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserVehicles = async (email) => {
    try {
      const response = await fetch(`http://localhost:8080/vehicles?email=${email}`);
      if (response.ok) {
        const vehiclesData = await response.json();
        console.log("Vehicles fetched:", vehiclesData); // Add this line
        setVehicles(vehiclesData);
      } else {
        console.error('Failed to fetch vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      return;
    }

    setUploading(true);

    try {
      let avatarUrl = formData.avatar;

      if (imageFile) {
        const formDataToUpload = new FormData();
        formDataToUpload.append('file', imageFile);
        formDataToUpload.append('upload_preset', 'vehicle_renting');

        const uploadResponse = await axios.post('https://api.cloudinary.com/v1_1/vehiclerenting/image/upload', formDataToUpload);
        avatarUrl = uploadResponse.data.secure_url;
      }

      const updatedUserData = {
        ...formData,
        avatar: avatarUrl,
      };

      const response = await fetch(`http://localhost:8080/user/${formData.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      if (response.ok) {
        setUser(updatedUserData);
        setEditMode(false);
        setAlertOpen(true);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          {user && (
            <Paper sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom sx={{color: '#1c4e80'}}>
                My Profile
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  alt="User Avatar"
                  src={user.avatar || "https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg"}
                  sx={{ width: 100, height: 100, mx: 'auto' }}
                />
              </Box>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                {editMode && (
                  <Button variant="outlined" component="label">
                    Upload Your Profile 
                    <input type="file" hidden onChange={handleImageChange} />
                  </Button>
                )}
              </Box>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={!editMode}
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={!editMode}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={!editMode}
              />
              {editMode ? (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveProfile}
                    disabled={uploading}
                    sx={{ mr: 2 }}
                  >
                    {uploading ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                  <Button variant="outlined" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button variant="contained" onClick={() => setEditMode(true)} fullWidth sx={{ mt: 3, color: 'white', backgroundColor: '#1c4e80' }}>
                  Edit Profile
                </Button>
              )}
            </Paper>
          )}
          <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={() => setAlertOpen(false)}
            message="Profile updated successfully"
          />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ color: '#1c4e80' }}>
            My Rented Vehicles
          </Typography>
          {vehicles.length === 0 ? (
            <Typography>No rented vehicles found.</Typography>
          ) : (
            vehicles.map((vehicle) => (
              <Paper key={vehicle.id} sx={{ p: 2, my: 2 }}>
                <Typography variant="h6">{vehicle.model}</Typography>
                <Typography>Pickup Point: {vehicle.pickupLocation}</Typography>
                <Typography>Rental Price: {vehicle.price}</Typography>
              </Paper>
            ))
          )}
        </Box>
      </Container>
    </>
  );
};

export default Profile;
