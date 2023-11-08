/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-useless-escape */
import { useAuthContext } from "../../providers/auth-provider";
import { Typography, Box, Button, IconButton } from "@mui/material";
import { showToastMessage, ToastMessage } from "../UserInterface/ToastMessage";
import { modalStyles } from "../UserInterface/Styles";
import { useState } from "react";
import { Info } from "../../types/interface";
import { isEmailValid, isValidPassword } from "./utils/validations";
import { FunctionalTextField } from "./utils/FormTextField";
import { emailErrorMessage, passwordErrorMessage } from "./utils/ErrorMessage";
import CloseIcon from "@mui/icons-material/Close";

export const AccountEdits = ({
  handleAccountEditClose,
}: {
  handleAccountEditClose: (info: Info) => void;
}) => {
  const { editUser } = useAuthContext();
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [toastMessage, setToastMessage] = useState({
    message: "",
    messageType: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  //validate the state inputs as they update
  const isEmailInputValid = isEmailValid(emailInput);
  const isPasswordInputValid = isValidPassword(passwordInput);

  const reset = () => {
    setEmailInput("");
    setPasswordInput("");
    setIsSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (isEmailInputValid && isPasswordInputValid) {
      editUser(emailInput, passwordInput);
      showToastMessage({
        message: "User details modified",
        messageType: "success",
      });
      handleAccountEditClose({
        message: "User details modified",
        messageType: "success",
      });
      reset();
    } else {
      setToastMessage({
        message: "Account Not Modified",
        messageType: "error",
      });
    }
  };

  return (
    <div>
      <Box
        sx={modalStyles}
        component="form"
        noValidate
        onSubmit={(e: React.FormEvent) => handleSubmit(e)}
      >
        <div id="modal-header">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Make changes to profile!
          </Typography>
          <IconButton
            onClick={() =>
              handleAccountEditClose({
                message: "",
                messageType: "",
              })
            }
          >
            <CloseIcon />
          </IconButton>
        </div>
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
          Edit Account
        </Button>
      </Box>
      {toastMessage.message !== "" && <ToastMessage info={toastMessage} />}
    </div>
  );
};
