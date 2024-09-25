import React from "react";
import { Grid, Box } from "@mui/material";
import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";
import MenuBar from "./menubar";

const AdminDashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <MenuBar/>
    </Box>
  );
};

export default AdminDashboard;
