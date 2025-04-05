import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import axios from "axios";

const Login = () => {
  const { userType } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const type = userType.toLowerCase();

      const endpoint = `/api/auth/${type === "admin" ? "admin" : type + "s"}/login`;


      const response = await axios.post(
        `http://localhost:3001${endpoint}`,
        formData
      );

      console.log("Login successful:", response.data);
      navigate(`/${type}-home`);
    } catch (err) {
      console.error("Login error:", err);
      setError("התחברות נכשלה. בדוק את הפרטים ונסה שוב.");
    }
  };

  const label =
    {
      customer: "לקוח",
      supplier: "ספק",
      admin: "מנהל",
    }[userType.toLowerCase()] || "משתמש";

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Typography variant="h5" align="center" gutterBottom>
        התחברות עבור {label}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="אימייל"
          name="email"
          type="email"
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="סיסמה"
          name="password"
          type="password"
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          התחברות
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
