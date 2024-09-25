import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Link,
  MenuItem,
} from "@mui/material";
// import bus from "./assets/bus.jpg";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosPublicCall } from "../../constants";

const Signup = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user", 
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}$/;
  const phoneRegex = /^[0-9]{10}$/;

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    let isValid = true;
    let tempErrors = {};

    if (userData.name.trim() === "") {
      tempErrors.name = "Name is required.";
      isValid = false;
    }

    if (!emailRegex.test(userData.email)) {
      tempErrors.email = "Invalid email format.";
      isValid = false;
    }

    if (!passRegex.test(userData.password)) {
      tempErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
      isValid = false;
    }

    if (!phoneRegex.test(userData.phone)) {
      tempErrors.phone = "Phone number must be 10 digits.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axiosPublicCall.post("user/signup", userData);

      toast.success("Signup successful!");
      console.log("Signup successful:", response.data);
    } catch (error) {
      setErrors("Signup failed. Please check your details.");
      toast.error("Signup failed. Please check your details.");
      console.error("There was an error during signup!", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
        //   backgroundImage: `url(${bus})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: 3,
              padding: 4,
              borderRadius: 2,
              width: "100%",
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
              Sign Up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ width: "100%" }}
            >
              <TextField
                error={!!errors.name}
                helperText={errors.name}
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                value={userData.name}
                onChange={inputChangeHandler}
              />
              <TextField
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={userData.email}
                onChange={inputChangeHandler}
              />
              <TextField
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={userData.password}
                onChange={inputChangeHandler}
              />
              <TextField
                error={!!errors.phone}
                helperText={errors.phone}
                margin="normal"
                required
                fullWidth
                name="phone"
                label="Phone Number"
                type="tel"
                id="phone"
                autoComplete="tel"
                value={userData.phone}
                onChange={inputChangeHandler}
              />

              <Grid container justifyContent="end">
                <Grid item>
                  <Link href="/" variant="body2">
                    Already have an account? Login
                  </Link>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "#1976d2" }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Signup;
