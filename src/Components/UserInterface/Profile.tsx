import { Typography, Box, IconButton } from "@mui/material";
import { useAuthContext } from "../../providers/auth-provider";
import { Artist, Client } from "../../types/interface";
import { modalStyles } from "./Styles";
import CloseIcon from "@mui/icons-material/Close";

export const ClientProfile = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuthContext();
  const { firstName, lastName, email, phoneNumber } = user as Client;
  return (
    <div>
      <Box sx={modalStyles} component="form" noValidate>
        <div id="modal-header">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            User Profile:
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Typography variant="h6" component="h4">
          Name: {firstName + " " + lastName}
        </Typography>
        <Typography variant="h6" component="h4">
          Email: {email}
        </Typography>
        <Typography variant="h6" component="h4">
          Phone: {phoneNumber}
        </Typography>
      </Box>
    </div>
  );
};

export const ArtistProfile = () => {
  const { user } = useAuthContext();
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    tattooStyles,
    statesLocation,
  } = user as Artist;
  return (
    <div>
      <Box sx={modalStyles} component="form" noValidate>
        <div id="modal-header">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            User Profile:
          </Typography>
          <IconButton>
            <CloseIcon />
          </IconButton>
        </div>
        <Typography variant="h6" component="h4">
          Name: {firstName + " " + lastName}
        </Typography>
        <Typography variant="h6" component="h4">
          Email: {email}
        </Typography>
        <Typography variant="h6" component="h4">
          Phone: {phoneNumber}
        </Typography>
        <Typography variant="h6" component="h4">
          Working in: {statesLocation}
        </Typography>
        <Typography variant="h6" component="h4">
          Working in: {tattooStyles}
        </Typography>
      </Box>
    </div>
  );
};
