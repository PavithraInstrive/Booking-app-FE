import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Divider,
  TextField,
  Button,
  Modal
} from "@mui/material";
import {
  AccessTime,
  Star,
  DirectionsBus,
  EventSeat,
  LocationOn,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosPrivateCall } from "../../constants";
import ScheduleBusForm from "../ScheduleBus";

const BusSearchAndListing = () => {
  const [buses, setBuses] = useState([]);
  const [message, setMessage] = useState("");
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: "",
  }); 
  const [openModal, setOpenModal] = useState(false); 

  // Fetch all buses initially
  useEffect(() => {
    const fetchAllBuses = async () => {
      try {
        const response = await axiosPrivateCall.get(`schedule/getScheduleBuses`, {
          params: {
            page: 1,
            limit: 10,
          },
        });
        setBuses(response.data.data);
        setMessage(response.data.message);
      } catch (error) {
        toast.error("Failed to fetch buses. Please try again.");
        console.error("Error fetching bus data:", error);
      }
    };

    fetchAllBuses();
  }, []);

  useEffect(() => {
    if (message) {
      toast.info(message);
    }
  }, [message]);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };
  const handleOpenModal = () => setOpenModal(true); 
  const handleCloseModal = () => setOpenModal(false); 

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
          date: new Date(searchParams.date).toISOString(),
          page: 1,
          limit: 10,
        },
      });

      setBuses(response.data.data);
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch buses. Please try again.";
      toast.error(errorMessage);
      setBuses([]);
    }
  };

  const today = new Date().toISOString().slice(0, 16);

  return (
    <>
      {/* <ToastContainer /> */}
      {/* Search Form */}
      <Box
        // maxWidth="xs"
        fullWidth
        border={1}
        sx={{
          //   backgroundColor: "#e53935",
          padding: 4,
          borderRadius: 2,
          //   boxShadow: 3,
          //   color: "white",
          //   mt: 4,
        }}
      >
        <Box component="form" onSubmit={handleSearch} noValidate>
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <TextField
                label="From"
                name="from"
                value={searchParams.from}
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
            <Grid item xs={3}>
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
            <Grid item xs={3}>
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
                  min: today,
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
            <Grid item xs={3}>
              <Button
                onClick={handleSearch}
                variant="contained"
                fullWidth
                sx={{
                  height: "56px",
                  backgroundColor: "#e53935",
                  borderRadius: "5px",
                  padding: "0 30px",
                  maxWidth: "100%",
                  fontWeight: "bold",
                  color: "white",
                  "&:hover": { backgroundColor: "#b71c1c" },
                }}
              >
                SEARCH BUSES
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Button
        sx={{
          height: "56px",
          backgroundColor: "#e53935",
          borderRadius: "5px",
          padding: "0 30px",
          maxWidth: "100%",
          fontWeight: "bold",
          color: "white",
          "&:hover": { backgroundColor: "#b71c1c" },
          float: "right",
          top: 10,
        }}
        onClick={handleOpenModal} 
      >
        Schedule Bus
      </Button>

      <Box
        fullWidth
        sx={{
          padding: 4,
          borderRadius: 2,
          mt: 4,
        }}
      >
        <Grid container spacing={3}>
          {buses.map((bus) => (
            <Grid item xs={12} sm={6} md={3} key={bus._id || bus.scheduleId}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {bus.busNumber}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {bus.startLocation} to {bus.endLocation}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mt: 1 }}
                  >
                    <DirectionsBus />
                    <Typography variant="body2">{bus.busType}</Typography>
                  </Stack>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    <AccessTime
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 1 }}
                    />
                   
                    {new Date(bus.departureTime).toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    <LocationOn
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 1 }}
                    />
                   {bus.startLocation} to {bus.endLocation}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="schedule-bus-modal"
        aria-describedby="modal-to-schedule-a-bus"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p:2,
          }}
        >
        <ScheduleBusForm handleCloseModal={handleCloseModal} />
        </Box>
      </Modal>
    </>
  );
};

export default BusSearchAndListing;
