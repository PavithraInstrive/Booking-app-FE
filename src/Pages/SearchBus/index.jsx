import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosPrivateCall } from "../../constants"; // Ensure axiosPrivateCall is configured correctly
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const BusSearch = () => {
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: "",
  });
  const navigate = useNavigate(); // Initialize the navigate hook

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchParams.from || !searchParams.to || !searchParams.date) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await axiosPrivateCall.get(`schedule/getScheduleBuses`, {
        params: {
          from: searchParams.from,
          to: searchParams.to,
          date: new Date(searchParams.date).toISOString(), // Convert date to ISO format
          page: 1,
          limit: 10,
        },
      });

      toast.success(response.data.message);

      // Navigate to BusListing page with data
      navigate("/buslisting", { state: { buses: response.data.data, message: response.data.message } });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch buses. Please try again.";
      toast.error(errorMessage);

      // Navigate to BusListing page with error message
      navigate("/bus-listing", { state: { buses: [], message: errorMessage } });
    }
  };

  // Get today's date in the format "YYYY-MM-DDTHH:MM" for the "min" attribute
  const today = new Date().toISOString().slice(0, 16);

  return (
    <>
      <ToastContainer />
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: "#e53935",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          color: "white",
          mt: 4,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          <span role="img" aria-label="bus">
            🚌
          </span>{" "}
          Search Buses
        </Typography>
        <Box component="form" onSubmit={handleSearch} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="From"
                name="from"
                value={searchParams.from}
                onChange={inputChangeHandler}
                fullWidth
                required
                sx={{
                  "& .MuiInputBase-root": {
                    color: "black", // Text color
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", // Border color
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="To"
                name="to"
                value={searchParams.to}
                onChange={inputChangeHandler}
                fullWidth
                required
                sx={{
                  "& .MuiInputBase-root": {
                    color: "black",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="date"
                label="Date"
                name="date"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={searchParams.date}
                onChange={inputChangeHandler}
                inputProps={{
                  min: today, // Restrict to today and future dates
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    color: "black",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#d32f2f", // Search button color
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#b71c1c", // Hover effect
                  },
                }}
              >
                SEARCH
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default BusSearch;
