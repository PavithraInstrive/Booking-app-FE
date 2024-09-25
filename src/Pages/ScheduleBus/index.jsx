import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton, // Import IconButton for the close button
} from "@mui/material";
import { Close } from "@mui/icons-material"; // Import Close icon
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Autocomplete } from "@mui/material";
import { axiosPrivateCall } from "../../constants";

// Validation Schema using Yup
const ScheduleBusSchema = Yup.object().shape({
  busId: Yup.string().required("Bus selection is required"),
  routeId: Yup.string().required("Route selection is required"),
  departureTime: Yup.string().required("Departure time is required"),
  arrivalTime: Yup.string().required("Arrival time is required"),
  price: Yup.number().required("Price is required").positive("Price must be positive"),
});

const ScheduleBusForm = ({ handleCloseModal }) => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [fieldsEnabled, setFieldsEnabled] = useState(false);  

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routeResponse = await axiosPrivateCall.get("route/routelist");
        setRoutes(routeResponse.data.data);
      } catch (error) {
        toast.error("Failed to fetch routes.");
      }
    };
    fetchRoutes();
  }, []);

  const fetchAvailableBuses = async (departureTime, arrivalTime) => {
    try {
      const response = await axiosPrivateCall.get(
        `bus/fetchAvailableBuses?departureTime=${departureTime}&arrivalTime=${arrivalTime}`
      );
      setBuses(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch available buses.");
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        busId: values.busId,
        routeId: values.routeId,
        departureTime: new Date(values.departureTime).toISOString(),
        arrivalTime: new Date(values.arrivalTime).toISOString(),
        price: values.price,
      };
      const response = await axiosPrivateCall.post("schedule/scheduleBus", payload);
      toast.success("Bus scheduled successfully!");
      resetForm();
      handleCloseModal(); // Close modal after successful submission
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to schedule bus.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 1 }}>
        {/* Modal Header with Title and Close Button */}
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4">Schedule Bus</Typography>
          <IconButton onClick={handleCloseModal} sx={{ color: "#1976d2" }}>
            <Close />
          </IconButton>
        </Grid>

        <Formik
          initialValues={{
            busId: "",
            routeId: "",
            departureTime: "",
            arrivalTime: "",
            price: "",
          }}
          validationSchema={ScheduleBusSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
            <Form>
              <Grid container spacing={3}>
                {/* Departure Time */}
                <Grid item xs={12}>
                  <TextField
                    label="Departure Time"
                    name="departureTime"
                    type="datetime-local"
                    fullWidth
                    value={values.departureTime}
                    onChange={(e) => {
                      handleChange(e);
                      if (values.arrivalTime) {
                        setFieldsEnabled(true);
                        fetchAvailableBuses(e.target.value, values.arrivalTime);
                      }
                    }}
                    onBlur={handleBlur}
                    error={touched.departureTime && Boolean(errors.departureTime)}
                    helperText={touched.departureTime && errors.departureTime}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Arrival Time */}
                <Grid item xs={12}>
                  <TextField
                    label="Arrival Time"
                    name="arrivalTime"
                    type="datetime-local"
                    fullWidth
                    value={values.arrivalTime}
                    onChange={(e) => {
                      handleChange(e);
                      if (values.departureTime) {
                        setFieldsEnabled(true);
                        fetchAvailableBuses(values.departureTime, e.target.value);
                      }
                    }}
                    onBlur={handleBlur}
                    error={touched.arrivalTime && Boolean(errors.arrivalTime)}
                    helperText={touched.arrivalTime && errors.arrivalTime}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Bus Selection (with Autocomplete for search) */}
                <Grid item xs={12}>
                  <Autocomplete
                    options={buses}
                    getOptionLabel={(option) => option.busNumber || ""}
                    onChange={(e, value) => setFieldValue("busId", value?._id)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Bus"
                        name="busId"
                        fullWidth
                        onBlur={handleBlur}
                        error={touched.busId && Boolean(errors.busId)}
                        helperText={touched.busId && errors.busId}
                        disabled={!fieldsEnabled}
                      />
                    )}
                  />
                </Grid>

                {/* Route Selection (with Autocomplete for search) */}
                <Grid item xs={12}>
                  <Autocomplete
                    options={routes}
                    getOptionLabel={(option) =>
                      `${option.startLocation} - ${option.endLocation}` || ""
                    }
                    onChange={(e, value) => setFieldValue("routeId", value?._id)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Route"
                        name="routeId"
                        fullWidth
                        onBlur={handleBlur}
                        error={touched.routeId && Boolean(errors.routeId)}
                        helperText={touched.routeId && errors.routeId}
                        disabled={!fieldsEnabled}
                      />
                    )}
                  />
                </Grid>

                {/* Price */}
                <Grid item xs={12}>
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    fullWidth
                    value={values.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.price && Boolean(errors.price)}
                    helperText={touched.price && errors.price}
                    disabled={!fieldsEnabled}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "#1976d2",
                      "&:hover": { backgroundColor: "#1565c0" },
                    }}
                    disabled={!fieldsEnabled}
                  >
                    Schedule Bus
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default ScheduleBusForm;
