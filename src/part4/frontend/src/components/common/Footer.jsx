import React from "react";
import { Container, Typography, Box, Grid, Link } from "@mui/material";
import { GitHub, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#2C3E50",
        color: "#fff",
        padding: "1.2rem 0",
        borderTop: "5px solid #1976d2",
        zIndex: 1300,
      }}
    >
      <Container>
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              מערכת ניהול המכולת
            </Typography>
            <Typography variant="body2" paragraph>
              © 2025 כל הזכויות שמורות.
            </Typography>
            <Typography variant="body2">
              פותח על ידי{" "}
              <Link
                href="https://www.linkedin.com/in/shira-braverman/"
                target="_blank"
                sx={{ color: "#90caf9" }}
              >
                שירה שפירא
              </Link>
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ textAlign: { xs: "right", md: "left" } }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              עקוב אחרינו
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
                justifyContent: { xs: "flex-start", md: "flex-start" },
              }}
            >
              <Link
                href="https://github.com/ShiraBraverman"
                target="_blank"
                sx={{ color: "#ffffff" }}
              >
                <GitHub fontSize="large" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/shira-braverman/"
                target="_blank"
                sx={{ color: "#ffffff" }}
              >
                <LinkedIn fontSize="large" />
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
