import React from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  MenuItem,
  FormGroup,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { axiosPrivateCall } from "../../constants";
import { useNavigate } from "react-router-dom";

// Validation Schema using Yup
const AddBusSchema = Yup.object().shape({
  busNumber: Yup.string().required("Bus number is required"),
  busType: Yup.string().oneOf(["AC/Sleeper", "Non-AC/Sleeper", "AC/Seater", "Non-AC/Seater"], "Invalid bus type").required("Bus type is required"),
  capacity: Yup.number()
    .required("Capacity is required")
    .positive("Capacity must be a positive number")
    .integer("Capacity must be an integer"),
});

const busTypes = ["AC/Sleeper", "Non-AC/Sleeper", "AC/Seater", "Non-AC/Seater"];

const AddBusForm = () => {
  const initialValues = {
    busNumber: "",
    busType: "",
    capacity: "",
    features: [], 
  };
const navigateTo = useNavigate()    
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await axiosPrivateCall.post("bus/addBus", values);
      toast.success("Bus added successfully!");
      resetForm();
      navigateTo("/buses");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add bus.";
      toast.error(errorMessage);
      console.error("Error adding bus:", error);
    }
  };

  const handleFeatureChange = (e, setFieldValue, values) => {
    const { name, checked } = e.target;
    const updatedFeatures = checked
      ? [...values.features, name]
      : values.features.filter((feature) => feature !== name);
    setFieldValue("features", updatedFeatures);
  };

  return (
    <>
      <ToastContainer />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Bus
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={AddBusSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
            <Form>
              <Grid container spacing={3}>
                {/* Bus Number Field */}
                <Grid item xs={12}>
                  <TextField
                    label="Bus Number"
                    name="busNumber"
                    fullWidth
                    value={values.busNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.busNumber && Boolean(errors.busNumber)}
                    helperText={touched.busNumber && errors.busNumber}
                  />
                </Grid>

                {/* Bus Type Field */}
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Bus Type"
                    name="busType"
                    fullWidth
                    value={values.busType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.busType && Boolean(errors.busType)}
                    helperText={touched.busType && errors.busType}
                  >
                    {busTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Capacity Field */}
                <Grid item xs={12}>
                  <TextField
                    label="Capacity"
                    name="capacity"
                    type="number"
                    fullWidth
                    value={values.capacity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.capacity && Boolean(errors.capacity)}
                    helperText={touched.capacity && errors.capacity}
                  />
                </Grid>

                {/* Features Checkboxes */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Features
                  </Typography>
                  <FormGroup>
                    {["wifi", "chargingPoints", "recliningSeats", "readingLights", "television"].map(
                      (feature) => (
                        <FormControlLabel
                          key={feature}
                          control={
                            <Checkbox
                              checked={values.features.includes(feature)}
                              onChange={(e) => handleFeatureChange(e, setFieldValue, values)}
                              name={feature}
                            />
                          }
                          label={feature
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())} // Capitalize labels
                        />
                      )
                    )}
                  </FormGroup>
                </Grid>

                {/* Submit and Reset Buttons */}
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      mr: 2,
                      backgroundColor: "#1976d2",
                      "&:hover": { backgroundColor: "#1565c0" },
                    }}
                  >
                    Add Bus
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

export default AddBusForm;
