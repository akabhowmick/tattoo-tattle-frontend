import React, { useState } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import { useRequestsContext } from "../../providers/requests-provider";
import { useAuthContext } from "../../providers/auth-provider";
import { ToastMessage } from "../UserInterface/ToastMessage";
import { errorStyle, modalStyles } from "../UserInterface/Styles";
import { Info, Request, Tattoo } from "../../types/interface";

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
  const { addRequest } = useRequestsContext();
  const [messageBody, setMessageBody] = useState("");
  const [validMessage, setValidMessage] = useState("Enter a message");
  const [toastMessage, setToastMessage] = useState({
    message: "",
    messageType: "",
  });

  const messageBodyValidation = (message: string) => {
    setMessageBody(message);
    if (message.length < 20) {
      setValidMessage("Invalid: enter a description (>20 char)");
    } else {
      setValidMessage("true");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const info =
      validMessage === "true"
        ? {
            message: "Request added",
            messageType: "success",
          }
        : {
            message: "Request Not Modified",
            messageType: "error",
          };
    if (validMessage === "true") {
      const newRequest: Request = {
        clientName: user!.firstName + " " + user!.lastName,
        artistName: tattoo.artistName,
        messageBody: messageBody,
        approvalStatus: "Pending",
        tattooOfInterestTitle: tattoo.title,
        clientId: user!.id!,
        artistId: tattoo.artistId,
      };
      addRequest(newRequest);
      tattooRequestSuccess(info);
      handleClose();
    }
    setToastMessage(info);
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Inquire Artist about Design
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            name="messageBody"
            label="Message Body"
            type="text"
            id="messageBody"
            autoComplete="message for artist"
            autoFocus
            value={messageBody}
            onChange={(e) => {
              messageBodyValidation(e.target.value);
            }}
          />
          {validMessage !== "true" && (
            <Typography sx={errorStyle} variant="h6" component="h6">
              {validMessage}
            </Typography>
          )}
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
