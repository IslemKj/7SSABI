// /**
//  * Layout principal avec sidebar
//  */
// import { useState } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Drawer,
//   AppBar,
//   Toolbar,
//   List,
//   Typography,
//   Divider,
//   IconButton,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Avatar,
//   Menu,
//   MenuItem,
// } from '@mui/material';
// import {
//   Menu as MenuIcon,
//   Dashboard as DashboardIcon,
//   People as PeopleIcon,
//   Inventory as InventoryIcon,
//   Receipt as ReceiptIcon,
//   AccountBalance as AccountBalanceIcon,
//   Logout as LogoutIcon,
//   Person as PersonIcon,
// } from '@mui/icons-material';
// import { useAuthStore } from '@/store/authStore';

// const drawerWidth = 240;

// interface MenuItem {
//   text: string;
//   icon: React.ReactNode;
//   path: string;
// }

// const menuItems: MenuItem[] = [
//   { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/' },
//   { text: 'Clients', icon: <PeopleIcon />, path: '/clients' },
//   { text: 'Produits', icon: <InventoryIcon />, path: '/products' },
//   { text: 'Factures', icon: <ReceiptIcon />, path: '/invoices' },
//   { text: 'Dépenses', icon: <AccountBalanceIcon />, path: '/expenses' },
// ];

// const Layout = () => {
//   const navigate = useNavigate();
//   const logout = useAuthStore((state) => state.logout);
//   const user = useAuthStore((state) => state.user);
  
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleMenuClick = (path: string) => {
//     navigate(path);
//     setMobileOpen(false);
//   };

//   const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleUserMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const drawer = (
//     <div>
//       <Toolbar>
//         <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
//           7SSABI
//         </Typography>
//       </Toolbar>
//       <Divider />
//       <List>
//         {menuItems.map((item) => (
//           <ListItem key={item.text} disablePadding>
//             <ListItemButton onClick={() => handleMenuClick(item.path)}>
//               <ListItemIcon>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );

//   return (
//     <Box sx={{ display: 'flex' }}>
//       {/* AppBar */}
//       <AppBar
//         position="fixed"
//         sx={{
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           ml: { sm: `${drawerWidth}px` },
//         }}
//       >
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ mr: 2, display: { sm: 'none' } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
//             Gestion & Comptabilité
//           </Typography>
          
//           {/* Menu utilisateur */}
//           <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
//             <Avatar sx={{ bgcolor: 'secondary.main' }}>
//               <PersonIcon />
//             </Avatar>
//           </IconButton>
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleUserMenuClose}
//           >
//             <MenuItem onClick={handleLogout}>
//               <ListItemIcon>
//                 <LogoutIcon fontSize="small" />
//               </ListItemIcon>
//               Déconnexion
//             </MenuItem>
//           </Menu>
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar */}
//       <Box
//         component="nav"
//         sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//       >
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{ keepMounted: true }}
//           sx={{
//             display: { xs: 'block', sm: 'none' },
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//           }}
//         >
//           {drawer}
//         </Drawer>
//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: 'none', sm: 'block' },
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//           }}
//           open
//         >
//           {drawer}
//         </Drawer>
//       </Box>

//       {/* Contenu principal */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           minHeight: '100vh',
//           backgroundColor: '#f5f5f5',
//         }}
//       >
//         <Toolbar />
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default Layout;




/**
 * Layout principal avec sidebar - Design Moderne
 */
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  alpha,
  useTheme,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  KeyboardArrowDown,
  Notifications,
  ShowChart as AnalyticsIcon,
  HelpOutline as HelpIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';
import NotificationMenu from '@/components/notifications/NotificationMenu';

const drawerWidth = 280;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Clients', icon: <PeopleIcon />, path: '/clients' },
  { text: 'Produits', icon: <InventoryIcon />, path: '/products' },
  { text: 'Factures et Devis', icon: <ReceiptIcon />, path: '/invoices' },
  { text: 'Dépenses', icon: <AccountBalanceIcon />, path: '/expenses' },
  { text: 'Profil', icon: <PeopleIcon />, path: '/profile' },
  { text: 'Aide', icon: <HelpIcon />, path: '/help' },
  { text: 'Administration', icon: <AdminIcon />, path: '/admin/users', adminOnly: true },
];

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const loadUser = useAuthStore((state) => state.loadUser);
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // Load user data on mount if not already loaded
    if (!user) {
      loadUser();
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.1)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.1)',
          pointerEvents: 'none',
        }
      }}
    >
      {/* Logo & Brand */}
      <Box
        sx={{
          p: 3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/logo.svg"
            alt="Involeo"
            style={{
              width: '100%',
              maxWidth: '220px',
              height: 'auto',
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mx: 2 }} />

      {/* Menu Items */}
      <List sx={{ px: 2, py: 3, flex: 1, position: 'relative', zIndex: 1 }}>
        {menuItems.filter(item => !item.adminOnly || user?.role === 'admin').map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleMenuClick(item.path)}
                sx={{
                  borderRadius: 2.5,
                  py: 1.5,
                  px: 2,
                  position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: active ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  bgcolor: active ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                  '&:hover': {
                    bgcolor: active ? 'rgba(102, 126, 234, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    transform: 'translateX(4px)',
                  },
                  '&::before': active ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 4,
                    height: '60%',
                    borderRadius: '0 4px 4px 0',
                    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                  } : {},
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.9375rem',
                  }}
                />
                {active && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#667eea',
                      boxShadow: '0 0 8px rgba(102, 126, 234, 0.8)',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Info at Bottom */}
      <Box
        sx={{
          p: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 2.5,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 8px rgba(102, 126, 234, 0.3)',
              }}
            >
              <PersonIcon />
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.name || 'Utilisateur'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {user?.email || 'user@example.com'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar Moderne */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.06)',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: 'none' },
              color: '#1e1b4b',
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Search or Title Area */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', md: 'block' },
              }}
            >
              Gestion & Comptabilité
            </Typography>
          </Box>

          {/* Notifications */}
          <NotificationMenu />

          {/* Menu utilisateur */}
          <Box
            onClick={handleUserMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              px: 2,
              py: 1,
              borderRadius: 3,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: alpha('#667eea', 0.08),
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 8px rgba(102, 126, 234, 0.3)',
              }}
            >
              <PersonIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#1e293b',
                  lineHeight: 1,
                }}
              >
                {user?.name || 'Utilisateur'}
              </Typography>
            </Box>
            <KeyboardArrowDown
              sx={{
                fontSize: 20,
                color: '#64748b',
                display: { xs: 'none', sm: 'block' },
              }}
            />
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.06)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                '& .MuiMenuItem-root': {
                  borderRadius: 1.5,
                  mx: 1,
                  my: 0.5,
                  px: 2,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: alpha('#667eea', 0.08),
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} />
              </ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Déconnexion
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          pt: { xs: 8, sm: 9 },
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;