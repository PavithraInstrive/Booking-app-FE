import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import RouteIcon from "@mui/icons-material/Route";
import BookIcon from "@mui/icons-material/Book";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InsightsIcon from "@mui/icons-material/Insights";
import SettingsIcon from "@mui/icons-material/Settings";

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <List>
        <ListItem button component="a" href="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard Overview" />
        </ListItem>
        <ListItem button component="a" href="/users">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="User Management" />
        </ListItem>
        <ListItem button component="a" href="/buses">
          <ListItemIcon>
            <DirectionsBusIcon />
          </ListItemIcon>
          <ListItemText primary="Bus Management" />
        </ListItem>
        <ListItem button component="a" href="/routes">
          <ListItemIcon>
            <RouteIcon />
          </ListItemIcon>
          <ListItemText primary="Route Management" />
        </ListItem>
        <ListItem button component="a" href="/bookings">
          <ListItemIcon>
            <BookIcon />
          </ListItemIcon>
          <ListItemText primary="Booking Management" />
        </ListItem>
        <ListItem button component="a" href="/financials">
          <ListItemIcon>
            <MonetizationOnIcon />
          </ListItemIcon>
          <ListItemText primary="Financial Management" />
        </ListItem>
        <ListItem button component="a" href="/analytics">
          <ListItemIcon>
            <InsightsIcon />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItem>
        <Divider />
        <ListItem button component="a" href="/settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
