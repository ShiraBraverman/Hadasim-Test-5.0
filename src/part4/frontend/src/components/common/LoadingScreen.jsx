import React, { useEffect, useState } from "react";
import { Container, CircularProgress, Typography } from "@mui/material";

const LoadingScreen = ({ message = "מכין את הכל בשבילך..." }) => {
  return (
    <Container maxWidth="xs" sx={{ mt: 10, textAlign: "center" }}>
      <CircularProgress color="primary" />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Container>
  );
};

export default LoadingScreen;
