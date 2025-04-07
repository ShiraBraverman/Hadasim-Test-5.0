import React from "react";
import { Button, Typography, Container, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleUserSelection = (type) => {
    navigate(`/login/${type.toLowerCase()}`);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 15, textAlign: "right" }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          textAlign: "center",
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#1976d2" }}
        >
          ברוכים הבאים למערכת ניהול המכולת 🏪
        </Typography>

        <Typography variant="h6" sx={{ mb: 4, color: "#546e7a" }}>
          בחרו את סוג המשתמש כדי להתחיל:
        </Typography>

        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              fullWidth
              size="large"
              color="primary"
              onClick={() => handleUserSelection("Customer")}
              sx={{ py: 1.5, fontSize: "1.1rem" }}
            >
              לקוח
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              fullWidth
              size="large"
              color="success"
              onClick={() => handleUserSelection("Supplier")}
              sx={{ py: 1.5, fontSize: "1.1rem" }}
            >
              ספק
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              fullWidth
              size="large"
              color="secondary"
              onClick={() => handleUserSelection("Admin")}
              sx={{ py: 1.5, fontSize: "1.1rem" }}
            >
              מנהל
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default HomePage;
