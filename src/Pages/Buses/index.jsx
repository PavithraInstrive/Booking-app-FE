import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Grid2,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosPrivateCall } from "../../constants";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Pagination from "../../components/pagination";
import { useNavigate } from "react-router-dom";

const BusTableListing = () => {
  const [buses, setBuses] = useState([]);
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const [totalCount, setTotalCount] = useState(0);
  const navigateTo = useNavigate();
  
  useEffect(() => {
    fetchBuses(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const fetchBuses = async (page, limit) => {
    try {
      const response = await axiosPrivateCall.get(`bus/getAllBuses`, {
        params: {
          page: page + 1,
          limit,
        },
      });
      setBuses(response.data.data);
      setMessage(response.data.message);
      setTotalCount(response.data.totalCount || 0); 
    } catch (error) {
      toast.error("Failed to fetch buses. Please try again.");
      console.error("Error fetching bus data:", error);
    }
  };

  useEffect(() => {
    if (message) {
      toast.info(message);
    }
  }, [message]);

  const handleMenuClick = (event, bus) => {
    setAnchorEl(event.currentTarget);
    setSelectedBus(bus);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBus(null);
  };

  const handleAddSchedule = () => {
    if (selectedBus) {
      handleMenuClose();
    }
  };

  const addbus= () =>{
    navigateTo("/addbus")
    console.log("Add bus");
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  return (
    <>
      {/* <ToastContainer /> */}
      <Box maxWidth="xl" sx={{ mt: 2 }}>
        <Grid2 container justifyContent="space-between" spacing={2}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Bus Listing
        </Typography>
        <Button sx={{ mb: 2 }} variant="contained" onClick={addbus}>+ Add Bus</Button>
        </Grid2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bus Number</TableCell>
                <TableCell>Bus Type</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Features</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buses.map((bus) => (
                <TableRow key={bus._id}>
                  <TableCell>{bus.busNumber}</TableCell>
                  <TableCell>{bus.busType}</TableCell>
                  <TableCell>{bus.capacity}</TableCell>
                  <TableCell>{bus.features.join(", ")}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={(event) => handleMenuClick(event, bus)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleAddSchedule}>Add Schedule</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Use the Pagination component */}
        <Pagination
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />

      </Box>
    </>
  );
};

export default BusTableListing;
