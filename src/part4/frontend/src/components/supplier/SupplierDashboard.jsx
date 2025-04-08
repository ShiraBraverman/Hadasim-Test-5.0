import React from "react";
import { Typography, Box } from "@mui/material";

export default function SupplierDashboard({ supplier }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5">ברוך הבא, {supplier.representativeName} 👋</Typography>
      <Typography sx={{ mt: 2 }}>מספר מזהה ספק: {supplier.id}</Typography>
      <Typography>שם החברה: {supplier.companyName}</Typography>
      <Typography>אימייל: {supplier.email}</Typography>
      <Typography>טלפון: {supplier.phoneNumber}</Typography>
    </Box>
  );
}