import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contest/UserContext";
import axios from "axios";

const translateUserType = (type) => {
  switch (type) {
    case "admin":
      return "מנהל";
    case "supplier":
      return "ספק";
    case "customer":
      return "לקוח";
    default:
      return "משתמש";
  }
};

const Navbar = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (user?.id && user?.userType) {
      console.log("user");
      console.log(user);

      const type = user.userType.toLowerCase();
      const endpoint = `http://localhost:3001/api/${
        type === "admin" ? "admin" : `${type}s/${user.id}`
      }`;

      axios
        .get(endpoint)
        .then((res) => {
          setUserName(res.data.name || res.data.representativeName);
        })
        .catch((err) => {
          alert("שגיאה בשליפת שם המשתמש:", err);
        });
    }
  }, [,user]);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    setUser(null);
    setUserName(null);
    setOpenDialog(false);
    navigate("/");
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">🛒 מערכת מכולת</Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          {userName && (
            <Typography
              variant="body1"
              sx={{ marginRight: 2, fontWeight: "bold" }}
            >
              שלום, {translateUserType(user.userType)} - {userName}
            </Typography>
          )}
          <Button color="inherit" component={Link} to="/">
            בית
          </Button>
          <Button color="inherit" component={Link} to="/customer">
            לקוח
          </Button>
          <Button color="inherit" component={Link} to="/supplier">
            ספק
          </Button>
          <Button color="inherit" component={Link} to="/manager">
            מנהל
          </Button>
          {user ? (
            <Button color="inherit" onClick={handleOpenDialog}>
              התנתק
            </Button>
          ) : null}
        </div>
      </Toolbar>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>האם אתה בטוח שברצונך להתנתק?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            לא תוכל להחזיר את הפעולה לאחר ההתנתקות.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            ביטול
          </Button>
          <Button onClick={handleLogout} color="secondary">
            התנתק
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Navbar;
