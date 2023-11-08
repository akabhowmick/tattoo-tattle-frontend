import { useState } from "react";
import { Typography, Box, Button, IconButton } from "@mui/material";
import { useTattooTattleContext } from "../../providers/tattoo-provider";
import { modalStyles } from "../UserInterface/Styles";
import { Info } from "../../types/interface";
import { isValidDescription, isValidTitle } from "./utils/validations";
import { FunctionalTextField } from "./utils/FormTextField";
import {
  descriptionErrorMessage,
  titleErrorMessage,
} from "./utils/ErrorMessage";
import CloseIcon from "@mui/icons-material/Close";

export const EditTattoo = ({
  id,
  handleClose,
  tattooEditSuccess,
}: {
  id: number;
  handleClose: () => void;
  tattooEditSuccess: (info: Info) => void;
}) => {
  const { updateTattoo } = useTattooTattleContext();
  const [descriptionInput, setDescriptionInput] = useState("");
  const [tattooTitleInput, setTattooTitleInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isDescriptionInputValid = isValidDescription(descriptionInput);
  const isTitleInputValid = isValidTitle(tattooTitleInput);

  const reset = () => {
    setDescriptionInput("");
    setTattooTitleInput("");
    setIsSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (isTitleInputValid && isDescriptionInputValid) {
      updateTattoo(id, tattooTitleInput, descriptionInput);
      reset();
      handleClose();
      tattooEditSuccess({
        message: "Tattoo details modified",
        messageType: "success",
      });
    }
  };

  return (
    <div>
      <Box sx={modalStyles} component="form" noValidate onSubmit={handleSubmit}>
        <div id="modal-header">
          <Typography
            id="modal-modal-title"
            style={{ color: "black" }}
            variant="h6"
            component="h2"
          >
            Update Tattoo Details
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <FunctionalTextField
          label="Tattoo Title"
          inputProps={{
            placeholder: "Enter a title here",
            value: tattooTitleInput,
            onChange: (e) => {
              setTattooTitleInput(e.target.value);
            },
          }}
          errorMessage={titleErrorMessage}
          shouldDisplayError={!isTitleInputValid && isSubmitted}
        />

        <FunctionalTextField
          label="Tattoo Description"
          inputProps={{
            placeholder: "Enter a description here",
            value: descriptionInput,
            onChange: (e) => {
              setDescriptionInput(e.target.value);
            },
          }}
          errorMessage={descriptionErrorMessage}
          shouldDisplayError={!isDescriptionInputValid && isSubmitted}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit Request
        </Button>
      </Box>
    </div>
  );
};
