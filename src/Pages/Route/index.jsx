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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddRouteForm from "../AddRoute";
import Pagination from "../../components/pagination";
import { axiosPrivateCall } from "../../constants";

const RouteListing = () => {
  const [open, setOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const fetchRoutes = async (page, limit) => {
    try {
      const response = await axiosPrivateCall.get(`route/routelist`, {
        params: {
          page: page + 1,
          limit,
        },
      });
      setRoutes(response.data.data);
      setTotalCount(response.data.totalCount || 0);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  useEffect(() => {
    fetchRoutes(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Route Listing</Typography>
        <Button variant="contained" onClick={handleClickOpen}>
          + Add Route
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start Location</TableCell>
              <TableCell>End Location</TableCell>
              <TableCell>Distance (km)</TableCell>
              <TableCell>Stops</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routes.length > 0 ? (
              routes.map((route) => (
                <TableRow key={route._id}>
                  <TableCell>{route.startLocation}</TableCell>
                  <TableCell>{route.endLocation}</TableCell>
                  <TableCell>{route.distance}</TableCell>
                  {/* <TableCell>{route.stops.join(", ")}</TableCell> */}
                  <TableCell>
                    {new Date(route.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No routes available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Component */}
      <Pagination
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />

      {/* Dialog for Add Route Form */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New Route
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddRouteForm handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RouteListing;
