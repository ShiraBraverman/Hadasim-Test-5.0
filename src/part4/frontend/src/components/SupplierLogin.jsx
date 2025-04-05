import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

const SupplierLogin = () => {
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [representative, setRepresentative] = useState('');
  const [goodsList, setGoodsList] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ companyName, phoneNumber, representative, goodsList });
  };

  return (
    <Container>
      <Typography variant="h4">רישום ספק חדש</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="שם החברה"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="מספר טלפון"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="שם נציג"
          value={representative}
          onChange={(e) => setRepresentative(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="רשימת סחורות"
          value={goodsList}
          onChange={(e) => setGoodsList(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit">
          רישום
        </Button>
      </form>
    </Container>
  );
};

export default SupplierLogin;
