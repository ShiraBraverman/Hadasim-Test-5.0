import React from "react";
import { Container, Typography, CircularProgress } from "@mui/material";

const LoadingScreen = ({ message = "מכין את הכל בשבילך..." }) => {
  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 10,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
      }}
    >
      <CircularProgress size={60} color="primary" />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Container>
  );
};

export default LoadingScreen;
