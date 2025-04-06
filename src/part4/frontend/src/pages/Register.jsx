import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import axios from "axios";

const Register = () => {
  const { userType } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phoneNumber: "",
    companyName: "",
    representativeName: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userType: userType.toLowerCase(),
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      };

      if (userType === "customer") {
        payload.name = formData.name;
      } else if (userType === "supplier") {
        payload.companyName = formData.companyName;
        payload.representativeName = formData.representativeName;
      }

      const response = await axios.post(
        "http://localhost:3001/api/auth/register",
        payload
      );
      console.log("Registration success:", response.data);

      setSuccess("נרשמת בהצלחה! מעביר לדף התחברות...");
      setTimeout(() => navigate(`/login/${userType}`), 2000);
    } catch (err) {
      alert("Registration error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "שגיאה בהרשמה");
    }
  };

  const isCustomer = userType === "customer";
  const isSupplier = userType === "supplier";

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Typography variant="h5" align="center" gutterBottom>
        הרשמה עבור {isCustomer ? "לקוח" : isSupplier ? "ספק" : "משתמש"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
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

        <TextField
          fullWidth
          label="טלפון"
          name="phoneNumber"
          margin="normal"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        {isCustomer && (
          <TextField
            fullWidth
            label="שם מלא"
            name="name"
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}

        {isSupplier && (
          <>
            <TextField
              fullWidth
              label="שם החברה"
              name="companyName"
              margin="normal"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="שם נציג"
              name="representativeName"
              margin="normal"
              value={formData.representativeName}
              onChange={handleChange}
              required
            />
          </>
        )}

        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          הרשמה
        </Button>
        <Typography align="center" sx={{ mt: 2 }}>
          כבר יש לך חשבון?{" "}
          <Link
            to={`/login/${userType}`}
            style={{ textDecoration: "underline", color: "#1976d2" }}
          >
            התחבר כאן
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
