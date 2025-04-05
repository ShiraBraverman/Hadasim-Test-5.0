import React, { useState } from "react";
import { Button, Typography, Container } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate(); // שים לב שהשימוש הוא ב-useNavigate

  const [userType, setUserType] = useState(null);

  const handleUserSelection = (type) => {
    setUserType(type);
    navigate(`/login/${type.toLowerCase()}`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>ברוכים הבאים למערכת ניהול המכולת 🏪</Typography>
      <Typography variant="body1">בחרו את סוג המשתמש כדי להתחיל:</Typography>

      <Button variant="contained" onClick={() => handleUserSelection("Customer")}>לקוח</Button>
      <Button variant="contained" onClick={() => handleUserSelection("Supplier")}>ספק</Button>
      <Button variant="contained" onClick={() => handleUserSelection("Admin")}>מנהל</Button>
    </Container>
  );
};

export default HomePage;
