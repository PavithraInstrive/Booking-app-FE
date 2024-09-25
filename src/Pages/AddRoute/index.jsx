import React, { useEffect } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { FieldArray, Formik, Form } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { axiosPrivateCall } from "../../constants";
import { fetchDistanceAndDuration } from "../../common/location";

// Validation Schema using Yup
const AddRouteSchema = Yup.object().shape({
  startLocation: Yup.string().required("Start location is required"),
  endLocation: Yup.string().required("End location is required"),
  distance: Yup.number()
    .required("Distance is required")
    .positive("Distance must be a positive number")
    .integer("Distance must be an integer"),
  duration: Yup.number()
    .required("Duration is required")
    .positive("Duration must be a positive number"),
  boardingPoints: Yup.array()
    .of(Yup.string().required("Boarding point is required"))
    .min(1, "At least one boarding point is required"),
  dropPoints: Yup.array()
    .of(Yup.string().required("Drop point is required"))
    .min(1, "At least one drop point is required"),
});

const AddRouteForm = ({ handleClose }) => {
  const initialValues = {
    startLocation: "",
    endLocation: "",
    distance: "",
    duration: "",
    boardingPoints: [""],
    dropPoints: [""],
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await axiosPrivateCall.post(`route/addRoute`, values);
      toast.success("Route added successfully!");
      resetForm();
      console.log("API response:", response.data);
      handleClose(); // Close the modal after successful submission
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add route.";
      toast.error(errorMessage);
      console.error("Error adding route:", error);
    }
  };

  const calculateDuration = (distance) => {
    const averageSpeed = 60; // Assuming average speed is 60 km/h
    const duration = distance / averageSpeed;
    return duration.toFixed(2); // Return duration in hours with 2 decimal places
  };

  return (
    <Container maxWidth="sm">
      {/* <ToastContainer /> */}
      <Typography variant="h4" gutterBottom>
        Add New Route
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={AddRouteSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
        }) => (
          <Form>
            <Grid container spacing={2}>
              {/* Start Location */}
              <Grid item xs={12}>
                <TextField
                  label="Start Location"
                  name="startLocation"
                  fullWidth
                  value={values.startLocation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.startLocation && Boolean(errors.startLocation)}
                  helperText={touched.startLocation && errors.startLocation}
                  variant="outlined"
                />
              </Grid>

              {/* End Location */}
              <Grid item xs={12}>
                <TextField
                  label="End Location"
                  name="endLocation"
                  fullWidth
                  value={values.endLocation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.endLocation && Boolean(errors.endLocation)}
                  helperText={touched.endLocation && errors.endLocation}
                  variant="outlined"
                />
              </Grid>

              {/* Distance */}
              <Grid item xs={12}>
                <TextField
                  label="Distance (km)"
                  name="distance"
                  type="number"
                  fullWidth
                  value={values.distance}
                  onChange={(e) => {
                    handleChange(e);
                    const newDuration = calculateDuration(e.target.value);
                    setFieldValue("duration", newDuration);
                  }}
                  onBlur={handleBlur}
                  error={touched.distance && Boolean(errors.distance)}
                  helperText={touched.distance && errors.distance}
                  variant="outlined"
                />
              </Grid>

              {/* Duration */}
              <Grid item xs={12}>
                <TextField
                  label="Duration (hours)"
                  name="duration"
                  type="number"
                  fullWidth
                  value={values.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.duration && Boolean(errors.duration)}
                  helperText={touched.duration && errors.duration}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Boarding Points
                </Typography>
                <FieldArray
                  name="boardingPoints"
                  render={(arrayHelpers) => (
                    <div>
                      {values.boardingPoints && values.boardingPoints.length > 0
                        ? values.boardingPoints.map((point, index) => (
                            <Grid
                              container
                              spacing={1}
                              key={index}
                              alignItems="center"
                            >
                              <Grid item xs>
                                <TextField
                                  name={`boardingPoints.${index}`}
                                  fullWidth
                                  value={point}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={
                                    touched.boardingPoints &&
                                    touched.boardingPoints[index] &&
                                    Boolean(errors.boardingPoints?.[index])
                                  }
                                  helperText={
                                    touched.boardingPoints &&
                                    touched.boardingPoints[index] &&
                                    errors.boardingPoints?.[index]
                                  }
                                  variant="outlined"
                                />
                              </Grid>
                              <Grid item>
                                <IconButton
                                  aria-label="remove boarding point"
                                  onClick={() => arrayHelpers.remove(index)}
                                  color="error"
                                >
                                  <RemoveCircleIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))
                        : null}
                      <Button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                        startIcon={<AddCircleIcon />}
                        sx={{ mt: 2 }}
                        variant="outlined"
                      >
                        Add Boarding Point
                      </Button>
                    </div>
                  )}
                />
              </Grid>

              {/* Drop Points */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Drop Points
                </Typography>
                <FieldArray
                  name="dropPoints"
                  render={(arrayHelpers) => (
                    <div>
                      {values.dropPoints && values.dropPoints.length > 0
                        ? values.dropPoints.map((point, index) => (
                            <Grid
                              container
                              spacing={1}
                              key={index}
                              alignItems="center"
                            >
                              <Grid item xs>
                                <TextField
                                  name={`dropPoints.${index}`}
                                  fullWidth
                                  value={point}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={
                                    touched.dropPoints &&
                                    touched.dropPoints[index] &&
                                    Boolean(errors.dropPoints?.[index])
                                  }
                                  helperText={
                                    touched.dropPoints &&
                                    touched.dropPoints[index] &&
                                    errors.dropPoints?.[index]
                                  }
                                  variant="outlined"
                                />
                              </Grid>
                              <Grid item>
                                <IconButton
                                  aria-label="remove drop point"
                                  onClick={() => arrayHelpers.remove(index)}
                                  color="error"
                                >
                                  <RemoveCircleIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          ))
                        : null}
                      <Button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                        startIcon={<AddCircleIcon />}
                        sx={{ mt: 2 }}
                        variant="outlined"
                      >
                        Add Drop Point
                      </Button>
                    </div>
                  )}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#115293",
                    },
                  }}
                >
                  Add Route
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AddRouteForm;
