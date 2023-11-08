import React, { useState } from "react";
import { Typography, Box, Button, IconButton } from "@mui/material";
import { useTattooRequestsContext } from "../../providers/tattoo-requests-provider";
import { useAuthContext } from "../../providers/auth-provider";
import { ToastMessage } from "../UserInterface/ToastMessage";
import { modalStyles } from "../UserInterface/Styles";
import { Info, TattooRequest, Tattoo } from "../../types/interface";
import { isValidMessage } from "./utils/validations";
import { FunctionalTextField } from "./utils/FormTextField";
import { messageErrorMessage } from "./utils/ErrorMessage";
import CloseIcon from "@mui/icons-material/Close";

export const CreateRequest = ({
  tattoo,
  handleClose,
  tattooRequestSuccess,
}: {
  tattoo: Tattoo;
  handleClose: () => void;
  tattooRequestSuccess: (info: Info) => void;
}) => {
  const { user } = useAuthContext();
  const { addTattooRequest } = useTattooRequestsContext();
  const [messageBody, setMessageBody] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isMessageInputValid = isValidMessage(messageBody);

  const [toastMessage, setToastMessage] = useState({
    message: "",
    messageType: "",
  });

  const reset = () => {
    setMessageBody("");
    setIsSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (isMessageInputValid) {
      const newRequest: TattooRequest = {
        clientName: user!.firstName + " " + user!.lastName,
        artistName: tattoo.artistName,
        messageBody: messageBody,
        approvalStatus: "Pending",
        tattooOfInterestTitle: tattoo.title,
        clientId: user!.id!,
        artistId: tattoo.artistId,
      };
      addTattooRequest(newRequest);
      tattooRequestSuccess({
        message: "Request added",
        messageType: "success",
      });
      setToastMessage({
        message: "Request added",
        messageType: "success",
      });
      reset();
      handleClose();
    }
  };

  return (
    <div>
      <div>
        <Box
          sx={modalStyles}
          component="form"
          noValidate
          onSubmit={handleSubmit}
        >
          <div id="modal-header">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Inquire Artist about Design
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <FunctionalTextField
            label="Message"
            inputProps={{
              placeholder: "Send a message to the artist",
              value: messageBody,
              onChange: (e) => {
                setMessageBody(e.target.value);
              },
            }}
            errorMessage={messageErrorMessage}
            shouldDisplayError={!isMessageInputValid && isSubmitted}
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
      {toastMessage.message !== "" && <ToastMessage info={toastMessage} />}
    </div>
  );
};
