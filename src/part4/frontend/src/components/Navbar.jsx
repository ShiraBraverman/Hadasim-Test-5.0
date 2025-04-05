import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">🛒 מערכת מכולת</Typography>
        <div>
          <Button color="inherit" component={Link} to="/">בית</Button>
          <Button color="inherit" component={Link} to="/customer">לקוח</Button>
          <Button color="inherit" component={Link} to="/supplier">ספק</Button>
          <Button color="inherit" component={Link} to="/manager">מנהל</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
