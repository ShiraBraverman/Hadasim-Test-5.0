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
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contest/UserContext";
import StoreIcon from "@mui/icons-material/Store";
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
  }, [, user]);

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
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", fontWeight: 600 }}
          >
            <StoreIcon sx={{ mr: 1 }} /> מערכת מכולת
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {user && (userName || user.userType) && (
              <Typography variant="body1" sx={{ mr: 3, fontWeight: 600 }}>
                שלום, {translateUserType(user.userType)}
                {userName && ` - ${userName}`}
              </Typography>
            )}

            <Button
              color="inherit"
              onClick={() => navigate("/")}
              sx={{ mr: 1 }}
            >
              בית
            </Button>

            {user && (
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => setOpenDialog(true)}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
                }}
              >
                התנתק
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ textAlign: "right" }}>
          האם אתה בטוח שברצונך להתנתק?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: "right" }}>
            לא תוכל להחזיר את הפעולה לאחר ההתנתקות.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-start" }}>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            ביטול
          </Button>
          <Button onClick={handleLogout} color="error" autoFocus>
            התנתק
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
