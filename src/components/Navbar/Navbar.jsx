import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import logoTTB from '../../assets/img/logo/Ttb_bank_logo.png'

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleLogout = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  return (
    <AppBar position="static" 
      style={{ 
        backgroundColor: '#e3eafd',
        color: '#0050f0',
        boxShadow: "none",
        WebkitBoxShadow: "none",
        MozBoxShadow: "none",
        // borderBottom: "3px solid #0050f0"
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
            src={logoTTB}
            alt="app logo"
            style={{ 
              width: "55px",
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/Home"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            | Deposit Statement Enrichment
          </Typography>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            | State
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} sx={{ p: 0 }}>
                <LogoutIcon fontSize="large" sx={{ color: '#0050f0' }}/>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;