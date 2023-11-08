import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  Paper,
  Box,
  Grid,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import loginImage from "../../assets/login.png";
import { useAuthContext } from "../../providers/auth-provider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  isEmailValid,
  isValidPassword,
} from "../CreateAndEditForms/utils/validations";
import { FunctionalTextField } from "../CreateAndEditForms/utils/FormTextField";
import {
  emailErrorMessage,
  passwordErrorMessage,
  userTypeErrorMessage,
} from "../CreateAndEditForms/utils/ErrorMessage";
import { errorStyle } from "../UserInterface/Styles";
import { Copyright } from "./Copyrights";

const theme = createTheme();

export const Login = () => {
  const { loggedIn, userType, setUserType, signInArtist, signInClient } =
    useAuthContext();
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [userTypeInput, setUserTypeInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isEmailInputValid = isEmailValid(emailInput);
  const isPasswordInputValid = isValidPassword(passwordInput);
  const reset = () => {
    setEmailInput("");
    setPasswordInput("");
    setIsSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (isEmailInputValid && isPasswordInputValid && userTypeInput) {
      reset();
      const user = {
        email: emailInput,
        password: passwordInput,
      };
      if (userTypeInput === "client") {
        setUserType("client");
        signInClient(user);
        navigate("/client-home");
      } else if (userTypeInput === "artist") {
        setUserType("artist");
        signInArtist(user);
        navigate("/artist-home");
      }
    }
  };

  return (
    <>
      {loggedIn && userType === "client" && (
        <Navigate to="/client-home" replace={true} />
      )}
      {loggedIn && userType === "artist" && (
        <Navigate to="/artist-home" replace={true} />
      )}
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: `url(${loginImage})`,
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in (For Existing Users)
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">
                      Account Type
                    </FormLabel>
                    <RadioGroup
                      autoFocus
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={userTypeInput}
                      onChange={(e) => setUserTypeInput(e.target.value)}
                      defaultValue="client"
                    >
                      <FormControlLabel
                        value="client"
                        control={<Radio />}
                        label="Client"
                      />
                      <FormControlLabel
                        value="artist"
                        control={<Radio />}
                        label="Artist"
                      />
                    </RadioGroup>
                    {!userTypeInput && isSubmitted && (
                      <Typography sx={errorStyle} variant="h6" component="h6">
                        {userTypeErrorMessage}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <FunctionalTextField
                  label="Email"
                  inputProps={{
                    placeholder: "ab@bing.net",
                    value: emailInput,
                    type: "text",
                    onChange: (e) => {
                      setEmailInput(e.target.value);
                    },
                  }}
                  errorMessage={emailErrorMessage}
                  shouldDisplayError={!isEmailInputValid && isSubmitted}
                />
                <FunctionalTextField
                  label="Password"
                  inputProps={{
                    placeholder: "Password1!",
                    value: passwordInput,
                    type: "password",
                    onChange: (e) => {
                      setPasswordInput(e.target.value);
                    },
                  }}
                  errorMessage={passwordErrorMessage}
                  shouldDisplayError={!isPasswordInputValid && isSubmitted}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item>
                    <Link to="/signup" replace={true}>
                      Don&#39;t have an account? Sign up Now!
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};
