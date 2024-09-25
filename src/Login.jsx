import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Link,
} from "@mui/material";
import bus from "./assets/bus.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosPublicCall } from "./constants";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = ({setIsAuthenticated}) => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");

  const navigateTo = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}$/;

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    let inputValue = value;

    // email validation with 320 characters
    if (name === "email" && inputValue.length > 320) {
      inputValue = inputValue.slice(0, 320);
    }

    // password validation with 64 characters
    if (name === "password" && inputValue.length > 64) {
      inputValue = inputValue.slice(0, 64);
    }

    setUserData({
      ...userData,
      [name]: inputValue,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
    setLoginError("");
  };

  const isEmailValid = (value) => {
    if (value.length === 0) {
      setErrors((prevState) => ({
        ...prevState,
        email: "Required",
      }));
      return false;
    }
    if (!emailRegex.test(value)) {
      setErrors((prevState) => ({
        ...prevState,
        email: "Invalid Email",
      }));
      return false;
    }
    return true;
  };

  const isPasswordValid = (value) => {
    if (value.length === 0) {
      setErrors((prevState) => ({
        ...prevState,
        password: "Required",
      }));
      return false;
    }
    if (!passRegex.test(value)) {
      setErrors((prevState) => ({
        ...prevState,
        password: "Password must be 8-64 characters long, with at least one digit, one lowercase, and one uppercase letter.",
      }));
      return false;
    }
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailValid(userData.email)) {
      return;
    }

    try {
      const response = await axiosPublicCall.post("user/login", userData);   
      const { accessToken, refreshToken } = response.data; 
      
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken); 
        setIsAuthenticated(true);
      navigateTo("/dashboard",{replace:true});
      toast.success(response.data.message || "Login successful!");
      console.log("Login successful:", response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
      setLoginError(errorMessage);
      toast.error(errorMessage);
      console.error("There was an error logging in!", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          backgroundImage: `url(${bus})`,
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
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ width: "100%" }}
            >
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
                autoFocus
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
                autoComplete="current-password"
                value={userData.password}
                onChange={inputChangeHandler}
              />
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Link component={Link} to="#" variant="body2">
                    Forgot Password?
                  </Link>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "#1976d2" }}
              >
                Login
              </Button>
              <Typography
                component="h5"
                variant="h6"
                sx={{ mb: 2, alignItems: "center", display: "flex", justifyContent: "center" }}
              >
                or
              </Typography>
              <Grid
                sx={{ mb: 2, alignItems: "center", display: "flex", justifyContent: "center" }}
                item
              >
                <Link component={Link} to="/register" variant="body2">
                  Don't have an account? Sign up
                </Link>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Login;
