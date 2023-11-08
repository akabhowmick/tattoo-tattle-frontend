/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-escape */
import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  Box,
  Grid,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  OutlinedInput,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { MuiTelInput } from "mui-tel-input";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import signupImage from "../../assets/signup.jpg";
import { useAuthContext } from "../../providers/auth-provider";
import { tattooStyles, usStates } from "../../api/config";
import { Navigate, Link } from "react-router-dom";
import { errorStyle } from "../UserInterface/Styles";
import { Artist, Client } from "../../types/interface";
import {
  isEmailValid,
  isValidName,
  isValidPassword,
  isValidPhoneNumber,
  isValidStatesInput,
  isValidTattooStyleInput,
} from "../CreateAndEditForms/utils/validations";
import { FunctionalTextField } from "../CreateAndEditForms/utils/FormTextField";
import {
  emailErrorMessage,
  firstNameErrorMessage,
  lastNameErrorMessage,
  passwordErrorMessage,
  phoneNumberErrorMessage,
  tattooStatesErrorMessage,
  tattooStylesErrorMessage,
  userTypeErrorMessage,
} from "../CreateAndEditForms/utils/ErrorMessage";
import { Copyright } from "./Copyrights";
import { MenuProps, getStyles } from "./selectStyles";

const emptyStringArr: string[] = [];
const theme = createTheme();

export const CreateAccount = () => {
  const { addClient, addArtist, userType, setUserType, loggedIn } =
    useAuthContext();
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [userTypeInput, setUserTypeInput] = useState("");
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [tattooStyleInput, setTattooStyleInput] = useState(emptyStringArr);
  const [statesInput, setStatesInput] = useState(emptyStringArr);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isFirstNameInputValid = isValidName(firstNameInput);
  const isLastNameInputValid = isValidName(lastNameInput);
  const isEmailInputValid = isEmailValid(emailInput);
  const isPasswordInputValid = isValidPassword(passwordInput);
  const isPhoneNumberInputValid = isValidPhoneNumber(phoneNumberInput);
  const isTattooStyleInputValid = isValidTattooStyleInput(tattooStyleInput);
  const isStatesInputValid = isValidStatesInput(statesInput);

  const reset = () => {
    setFirstNameInput("");
    setLastNameInput("");
    setEmailInput("");
    setPasswordInput("");
    setUserTypeInput("");
    setPhoneNumberInput("");
    setTattooStyleInput(emptyStringArr);
    setStatesInput(emptyStringArr);
    setIsSubmitted(false);
  };

  const handleTattooStyleChange = (event: SelectChangeEvent<string>) => {
    setTattooStyleInput(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };

  const handleUsStatesChange = (event: SelectChangeEvent<string>) => {
    setStatesInput(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (
      isEmailInputValid &&
      isPasswordInputValid &&
      isFirstNameInputValid &&
      isLastNameInputValid &&
      userTypeInput &&
      isPhoneNumberInputValid
    ) {
      if (userTypeInput === "client") {
        const newClient: Client = {
          firstName: firstNameInput,
          lastName: lastNameInput,
          email: emailInput,
          password: passwordInput,
          phoneNumber: phoneNumberInput,
          type: "Client",
        };
        addClient(newClient);
      } else if (
        userTypeInput === "artist" &&
        isTattooStyleInputValid &&
        isStatesInputValid
      ) {
        const newArtist: Artist = {
          firstName: firstNameInput,
          lastName: lastNameInput,
          email: emailInput,
          password: passwordInput,
          phoneNumber: phoneNumberInput,
          type: "Artist",
          statesLocation: statesInput.toString(),
          tattooStyles: tattooStyleInput.toString(),
        };
        addArtist(newArtist);
      }
      setUserType(userTypeInput);
      reset();
    }
  };

  return (
    <div className="create-account">
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
              backgroundImage: `url(${signupImage})`,
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
                Sign in
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
                      onChange={(event) => setUserTypeInput(event.target.value)}
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
                <Grid container spacing={2}>
                  <div className="field-error-div">
                    <Grid item xs={12}>
                      <FunctionalTextField
                        label="First Name"
                        inputProps={{
                          placeholder: "First Name*",
                          value: firstNameInput,
                          type: "text",
                          onChange: (e) => {
                            setFirstNameInput(e.target.value);
                          },
                        }}
                        errorMessage={firstNameErrorMessage}
                        shouldDisplayError={
                          !isFirstNameInputValid && isSubmitted
                        }
                      />
                    </Grid>
                  </div>

                  <div className="field-error-div">
                    <Grid item xs={12}>
                      <FunctionalTextField
                        label="Last Name"
                        inputProps={{
                          placeholder: "Last Name*",
                          value: lastNameInput,
                          type: "text",
                          onChange: (e) => {
                            setLastNameInput(e.target.value);
                          },
                        }}
                        errorMessage={lastNameErrorMessage}
                        shouldDisplayError={
                          !isLastNameInputValid && isSubmitted
                        }
                      />
                    </Grid>
                  </div>

                  <Grid item xs={12}>
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
                  </Grid>

                  <Grid item xs={12}>
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
                  </Grid>

                  <Grid item xs={12}>
                    <MuiTelInput
                      fullWidth
                      value={phoneNumberInput}
                      onChange={setPhoneNumberInput}
                      forceCallingCode
                      preferredCountries={["US"]}
                      defaultCountry={"US"}
                    />
                    {isSubmitted && !isPhoneNumberInputValid && (
                      <Typography sx={errorStyle} variant="h6" component="h6">
                        {phoneNumberErrorMessage}
                      </Typography>
                    )}
                  </Grid>

                  {userTypeInput === "artist" && (
                    <div className="artist-add-ons">
                      <Grid container spacing={2}>
                        <div className="field-error-div">
                          <Grid item xs={12}>
                            <FormControl sx={{ m: 2, width: 120 }}>
                              <InputLabel id="demo-multiple-chip-label">
                                Location
                              </InputLabel>
                              <Select
                                required
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple={true}
                                // @ts-ignore
                                value={statesInput}
                                onChange={handleUsStatesChange}
                                input={
                                  <OutlinedInput
                                    id="select-multiple-chip"
                                    label="States of Operation"
                                  />
                                }
                                renderValue={() => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {statesInput.map((value) => (
                                      <Chip key={value} label={value} />
                                    ))}
                                  </Box>
                                )}
                                MenuProps={MenuProps}
                              >
                                {usStates.map((name) => (
                                  <MenuItem
                                    key={name}
                                    value={name}
                                    style={getStyles(name, statesInput, theme)}
                                  >
                                    {name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          {isSubmitted && !isStatesInputValid && (
                            <Typography
                              sx={errorStyle}
                              variant="h6"
                              component="h6"
                            >
                              {tattooStatesErrorMessage}
                            </Typography>
                          )}
                        </div>
                        <div className="field-error-div">
                          <Grid item xs={12}>
                            <FormControl sx={{ m: 2, width: 200 }}>
                              <InputLabel>Tattoo Style(s)</InputLabel>
                              <Select
                                required
                                labelId="demo-multiple-chip-label"
                                multiple={true}
                                // @ts-ignore
                                value={tattooStyleInput}
                                onChange={handleTattooStyleChange}
                                input={
                                  <OutlinedInput label="Tattoo Style(s)" />
                                }
                                renderValue={() => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {tattooStyleInput.map((value) => (
                                      <Chip key={value} label={value} />
                                    ))}
                                  </Box>
                                )}
                                MenuProps={MenuProps}
                              >
                                {tattooStyles.map((name) => (
                                  <MenuItem
                                    key={name}
                                    value={name}
                                    style={getStyles(
                                      name,
                                      tattooStyleInput,
                                      theme
                                    )}
                                  >
                                    {name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          {isSubmitted && !isTattooStyleInputValid && (
                            <Typography
                              sx={errorStyle}
                              variant="h6"
                              component="h6"
                            >
                              {tattooStylesErrorMessage}
                            </Typography>
                          )}
                        </div>
                      </Grid>
                    </div>
                  )}
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, ":focus": { outline: "none" } }}
                  className="btn-no-outline"
                >
                  Create an Account!
                </Button>
                <Grid container>
                  <Grid item>
                    <Link to="/" replace={true}>
                      Already have an account? Log in Now!
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
};
