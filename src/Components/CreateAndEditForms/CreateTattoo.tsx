/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useTattooTattleContext } from "../../providers/tattoo-provider";
import { useAuthContext } from "../../providers/auth-provider";
import { ToastMessage } from "../UserInterface/ToastMessage";
import { storage } from "../UserInterface/ImageFirebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { Artist, Tattoo } from "../../types/interface";
import {
  isValidDescription,
  isValidImage,
  isValidPrice,
  isValidStatesInput,
  isValidTattooStyleInput,
  isValidTitle,
} from "./utils/validations";
import { errorStyle } from "../UserInterface/Styles";
import {
  descriptionErrorMessage,
  imageErrorMessage,
  priceErrorMessage,
  tattooStatesErrorMessage,
  tattooStylesErrorMessage,
  titleErrorMessage,
} from "./utils/ErrorMessage";
import { FunctionalTextField } from "./utils/FormTextField";
import { MenuProps, getStyles } from "../Login/selectStyles";

const emptyStringArr: string[] = [];

export const CreateTattoo = () => {
  const { addTattoo } = useTattooTattleContext();
  const authContext = useAuthContext();
  const user = authContext.user as Artist;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tattooStyleInput, setTattooStyleInput] = useState(emptyStringArr);
  const [statesInput, setStatesInput] = useState(emptyStringArr);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [toastMessage, setToastMessage] = useState({
    message: "",
    messageType: "",
  });

  const reset = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setImage("");
    setTattooStyleInput(emptyStringArr);
    setStatesInput(emptyStringArr);
    setIsSubmitted(false);
  };

  const isDescriptionInputValid = isValidDescription(description);
  const isTitleInputValid = isValidTitle(title);
  const isPriceInputValid = isValidPrice(price);
  const isImageInputValid = isValidImage(image);
  const isTattooStyleInputValid = isValidTattooStyleInput(tattooStyleInput);
  const isStatesInputValid = isValidStatesInput(statesInput);

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

  const imageValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File = e.target.files![0];
    const imageURL = URL.createObjectURL(file);
    if (file) {
      uploadImageToFirebase(file);
      setImage(imageURL);
    }
  };

  const uploadImageToFirebase = (file?: File) => {
    if (file) {
      const imageRef = ref(storage, `images/${file.name + v4()}`);
      uploadBytes(imageRef, file).then((snapshot) =>
        getDownloadURL(snapshot.ref).then((url) => setImageUrl(url))
      );
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (
      isImageInputValid &&
      isTitleInputValid &&
      isDescriptionInputValid &&
      isTattooStyleInputValid &&
      isStatesInputValid &&
      isPriceInputValid &&
      imageUrl
    ) {
      const newTattoo: Tattoo = {
        artistId: user.id!,
        title: title,
        image: imageUrl,
        dateCreated: new Date().toLocaleDateString(),
        artistName: user.firstName + " " + user.lastName,
        description: description,
        price: parseInt(price),
        statesInput: statesInput.toString(),
        tattooStyleInput: tattooStyleInput.toString(),
      };
      addTattoo(newTattoo);

      reset();
      setToastMessage({ message: "Tattoo added", messageType: "success" });
    }
  };

  const theme = createTheme();

  const currentStates = statesInput;
  const currentTattooStates = tattooStyleInput;

  return (
    <div>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Typography
          id="modal-modal-title"
          style={{ color: "black" }}
          variant="h6"
          component="h2"
        >
          Add New Tattoo To Your Collection
        </Typography>
        <FunctionalTextField
          label="Tattoo Title"
          inputProps={{
            placeholder: "Enter a title here",
            value: title,
            onChange: (e) => {
              setTitle(e.target.value);
            },
          }}
          errorMessage={titleErrorMessage}
          shouldDisplayError={!isTitleInputValid && isSubmitted}
        />

        <FunctionalTextField
          label="Tattoo Description"
          inputProps={{
            placeholder: "Enter a description here",
            value: description,
            onChange: (e) => {
              setDescription(e.target.value);
            },
          }}
          errorMessage={descriptionErrorMessage}
          shouldDisplayError={!isDescriptionInputValid && isSubmitted}
        />

        <div className="form-flex-div">
          <div className="field-error-div">
            <FormControl sx={{ m: 2, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Price
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={price}
                label="Price Range"
                onChange={(e) => setPrice(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={100}>&lt; 100</MenuItem>
                <MenuItem value={500}>100 - 500</MenuItem>
                <MenuItem value={1000}>500 - 1000</MenuItem>
                <MenuItem value={1001}>&gt; 1000</MenuItem>
              </Select>
            </FormControl>
            {!isPriceInputValid && isSubmitted && (
              <Typography sx={errorStyle} variant="h6" component="h6">
                {priceErrorMessage}
              </Typography>
            )}
          </div>
          <div className="field-error-div">
            <FormControl sx={{ m: 2, width: 120 }}>
              <InputLabel id="demo-multiple-chip-label">Location</InputLabel>
              <Select
                required
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple={true}
                // @ts-ignore
                value={currentStates}
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
                {user.statesLocation!.split(",").map((name: string) => (
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
            {isSubmitted && !isStatesInputValid && (
              <Typography sx={errorStyle} variant="h6" component="h6">
                {tattooStatesErrorMessage}
              </Typography>
            )}
          </div>
          <div className="field-error-div">
            <FormControl sx={{ m: 2, width: 200 }}>
              <InputLabel>Tattoo Style(s)</InputLabel>
              <Select
                required
                labelId="demo-multiple-chip-label"
                multiple={true}
                // @ts-ignore
                value={currentTattooStates}
                onChange={handleTattooStyleChange}
                input={<OutlinedInput label="Tattoo Style(s)" />}
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
                {user.tattooStyles!.split(",").map((name: string) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, tattooStyleInput, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {isSubmitted && !isTattooStyleInputValid && (
              <Typography sx={errorStyle} variant="h6" component="h6">
                {tattooStylesErrorMessage}
              </Typography>
            )}
          </div>
        </div>
        <div className="upload-file-div">
          <Button variant="contained" component="label">
            Upload File
            <input type="file" hidden onChange={(e) => imageValidation(e)} />
          </Button>
          <img className="create-tat-img" src={image} />
          {isSubmitted && !isImageInputValid && (
            <Typography sx={errorStyle} variant="h6" component="h6">
              {imageErrorMessage}
            </Typography>
          )}
          {isSubmitted && !imageUrl && image &&(
          <Typography sx={errorStyle} variant="h6" component="h6">
            Waiting for image to upload to our server...
          </Typography>
        )}
        </div>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Add New Tattoo!
        </Button>
      </Box>
      {toastMessage.message !== "" && <ToastMessage info={toastMessage} />}
    </div>
  );
};
