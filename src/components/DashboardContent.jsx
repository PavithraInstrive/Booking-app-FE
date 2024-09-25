import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import AdminDashboard from "./AdminDashboard";
import MenuBar from "./menubar";

const DashboardContent = () => {
  return (
    <>
      <MenuBar />
      <Grid container spacing={3}>
        {/* Total Users Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">1,234</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Total Bookings Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Bookings</Typography>
              <Typography variant="h4">567</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Total Revenue Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Buses</Typography>
              <Typography variant="h4">452</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Add more cards or content as needed */}
      </Grid>
    </>
  );
};

export default DashboardContent;
