import React, { useState, useEffect } from "react";
import { Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/common/LoadingScreen";
import { useUser } from "../contest/UserContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      navigate(`/${user.userType}-home`);
    }
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (loggedUser && loggedUser.userType) {
      setUser(loggedUser);
      navigate(`/${loggedUser.userType}-home`);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [navigate]);

  const handleUserSelection = (type) => {
    navigate(`/login/${type.toLowerCase()}`);
  };

  if (loading) {
    return <LoadingScreen message="בודק פרטי התחברות..." />;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        ברוכים הבאים למערכת ניהול המכולת 🏪
      </Typography>
      <Typography variant="body1">בחרו את סוג המשתמש כדי להתחיל:</Typography>

      <Button
        variant="contained"
        onClick={() => handleUserSelection("Customer")}
      >
        לקוח
      </Button>
      <Button
        variant="contained"
        onClick={() => handleUserSelection("Supplier")}
      >
        ספק
      </Button>
      <Button variant="contained" onClick={() => handleUserSelection("Admin")}>
        מנהל
      </Button>
    </Container>
  );
};

export default HomePage;
