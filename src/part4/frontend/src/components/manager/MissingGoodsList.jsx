import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Alert,
  AlertTitle,
} from "@mui/material";

const MissingGoodsList = ({ missingGoods }) => {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        מוצרים שלא נמצאו להם ספקים 📦
      </Typography>

      {missingGoods.length === 0 ? (
        <Alert severity="success" sx={{ mt: 2 }}>
          <AlertTitle>בשורות טובות</AlertTitle>
          כל הכבוד! לכל המוצרים יש ספקים ✅
        </Alert>
      ) : (
        <Box sx={{ mt: 2, overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>מזהה מוצר</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>שם מוצר</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>כמות מלאה</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>כמות מינימום</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>כמות חסרה</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>תאריך יצירה</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {missingGoods.map((item) => (
                <TableRow key={item.goodId}>
                  <TableCell>{item.goodId}</TableCell>
                  <TableCell>{item.goodName}</TableCell>
                  <TableCell>{item.currentAmount}</TableCell>
                  <TableCell>{item.minAmount}</TableCell>
                  <TableCell sx={{ color: "error.main", fontWeight: "bold" }}>
                    {item.missingAmount}
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdDate).toLocaleDateString("he-IL")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Paper>
  );
};

export default MissingGoodsList;
